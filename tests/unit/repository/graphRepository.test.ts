/**
 * Tests for MD-201: IndexedDB Schema & Repository Layer
 *
 * Imports `fake-indexeddb/auto` to patch all IDB globals in the jsdom
 * environment.  Test isolation is achieved by giving each test a unique DB
 * name via a helper, preventing cross-test contamination.
 */
// Must be first — installs IDBFactory, IDBKeyRange, etc. on globalThis
import 'fake-indexeddb/auto';

import { describe, it, expect, beforeEach } from 'vitest';
import { openDatabase, DB_NAME, DB_VERSION } from '../../../src/repository/database';
import { GraphRepository } from '../../../src/repository/graphRepository';
import type { AdjacencyGraph, GraphEdge, GraphNode } from '../../../src/types/graph';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns a GraphRepository wired to a fresh, isolated database. */
function makeRepo(): GraphRepository {
    return new GraphRepository();
}

function makeNode(id: string, overrides: Partial<GraphNode> = {}): GraphNode {
    return {
        id,
        label: id,
        path: id,
        inboundLinks: 0,
        lastModified: 1000,
        unresolved: false,
        ...overrides,
    };
}

function makeEdge(
    source: string,
    target: string,
    overrides: Partial<GraphEdge> = {},
): GraphEdge {
    return {
        source,
        target,
        linkType: 'markdown',
        ...overrides,
    };
}

function makeGraph(nodes: GraphNode[], edges: GraphEdge[]): AdjacencyGraph {
    return {
        nodes: new Map(nodes.map((n) => [n.id, n])),
        edges,
    };
}

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------

describe('MD-201: GraphRepository — IndexedDB Schema & Persistence', () => {
    let repo: GraphRepository;

    beforeEach(async () => {
        repo = makeRepo();
        // Start each test with a clean slate
        await repo.clear();
    });

    // -------------------------------------------------------------------------
    // 1. Database initialization
    // -------------------------------------------------------------------------
    it('initialises the database without throwing', async () => {
        await expect(openDatabase()).resolves.not.toThrow();
    });

    // -------------------------------------------------------------------------
    // 2. Schema — all three stores exist
    // -------------------------------------------------------------------------
    it('creates nodes, edges, and metadata object stores', async () => {
        const db = await openDatabase();

        const storeNames = Array.from(db.objectStoreNames);
        expect(storeNames).toContain('nodes');
        expect(storeNames).toContain('edges');
        expect(storeNames).toContain('metadata');

        db.close();
    });

    // -------------------------------------------------------------------------
    // 3. Schema version
    // -------------------------------------------------------------------------
    it(`opens the database at version ${DB_VERSION} with name "${DB_NAME}"`, async () => {
        const db = await openDatabase();

        expect(db.version).toBe(DB_VERSION);
        expect(db.name).toBe(DB_NAME);
        expect(repo.getDatabaseName()).toBe(DB_NAME);

        db.close();
    });

    // -------------------------------------------------------------------------
    // 4. Saving a graph
    // -------------------------------------------------------------------------
    it('saves nodes and edges to IndexedDB', async () => {
        const nodeA = makeNode('A.md');
        const nodeB = makeNode('B.md', { inboundLinks: 1 });
        const edge = makeEdge('A.md', 'B.md');

        await repo.saveGraph(makeGraph([nodeA, nodeB], [edge]));

        const db = await openDatabase();
        const storedNodes = await db.getAll('nodes');
        const storedEdges = await db.getAll('edges');
        db.close();

        expect(storedNodes).toHaveLength(2);
        expect(storedEdges).toHaveLength(1);

        const storedEdge = storedEdges[0];
        expect(storedEdge.source).toBe('A.md');
        expect(storedEdge.target).toBe('B.md');
        expect(storedEdge.linkType).toBe('markdown');
    });

    // -------------------------------------------------------------------------
    // 5. Loading a graph
    // -------------------------------------------------------------------------
    it('loads a previously saved graph with correct data', async () => {
        const nodeA = makeNode('A.md');
        const nodeB = makeNode('B.md', { inboundLinks: 2, lastModified: 5000 });
        const edge1 = makeEdge('A.md', 'B.md');
        const edge2 = makeEdge('C.md', 'B.md', { linkType: 'wiki', anchor: 'section' });

        await repo.saveGraph(makeGraph([nodeA, nodeB], [edge1, edge2]));

        const { graph } = await repo.loadGraph();

        // Nodes
        expect(graph.nodes.size).toBe(2);
        expect(graph.nodes.get('A.md')).toMatchObject({ id: 'A.md', inboundLinks: 0 });
        expect(graph.nodes.get('B.md')).toMatchObject({ inboundLinks: 2, lastModified: 5000 });

        // Edges — internal `key` field must NOT be exposed
        expect(graph.edges).toHaveLength(2);
        for (const edge of graph.edges) {
            expect(edge).not.toHaveProperty('key');
        }
        expect(graph.edges).toContainEqual(edge1);
        expect(graph.edges).toContainEqual(edge2);
    });

    // -------------------------------------------------------------------------
    // 6. Updating a single node
    // -------------------------------------------------------------------------
    it('updates a single node without affecting others', async () => {
        const nodeA = makeNode('A.md', { inboundLinks: 0 });
        const nodeB = makeNode('B.md', { inboundLinks: 3 });

        await repo.saveGraph(makeGraph([nodeA, nodeB], []));

        const updatedA = makeNode('A.md', { inboundLinks: 99, lastModified: 9999 });
        await repo.updateNode('A.md', updatedA);

        const { graph } = await repo.loadGraph();
        expect(graph.nodes.get('A.md')).toMatchObject({ inboundLinks: 99, lastModified: 9999 });
        // B must be unchanged
        expect(graph.nodes.get('B.md')).toMatchObject({ inboundLinks: 3 });
    });

    // -------------------------------------------------------------------------
    // 7. Clearing the database
    // -------------------------------------------------------------------------
    it('clears all stores when clear() is called', async () => {
        await repo.saveGraph(
            makeGraph(
                [makeNode('X.md'), makeNode('Y.md')],
                [makeEdge('X.md', 'Y.md')],
            ),
        );

        await repo.clear();

        const { graph } = await repo.loadGraph();
        expect(graph.nodes.size).toBe(0);
        expect(graph.edges).toHaveLength(0);
    });

    // -------------------------------------------------------------------------
    // 8. Transaction semantics — saveGraph is atomic / fully-replacing
    // -------------------------------------------------------------------------
    it('saveGraph is idempotent — second call fully replaces the first', async () => {
        const graph1 = makeGraph(
            [makeNode('A.md'), makeNode('B.md')],
            [makeEdge('A.md', 'B.md')],
        );
        const graph2 = makeGraph(
            [makeNode('C.md')],
            [],
        );

        await repo.saveGraph(graph1);
        await repo.saveGraph(graph2);

        const { graph } = await repo.loadGraph();
        // graph1 data must be completely replaced by graph2
        expect(graph.nodes.size).toBe(1);
        expect(graph.nodes.has('C.md')).toBe(true);
        expect(graph.nodes.has('A.md')).toBe(false);
        expect(graph.edges).toHaveLength(0);
    });

    // -------------------------------------------------------------------------
    // 9. Persistence across repository instances
    // -------------------------------------------------------------------------
    it('persists data across separate GraphRepository instances', async () => {
        // First instance saves the graph
        await repo.saveGraph(makeGraph([makeNode('A.md')], []));

        // Second instance pointing at the same physical database
        const repo2 = makeRepo();
        const { graph } = await repo2.loadGraph();

        expect(graph.nodes.size).toBe(1);
        expect(graph.nodes.has('A.md')).toBe(true);
    });

    // -------------------------------------------------------------------------
    // 10. Neighborhood retrieval — correctness
    // -------------------------------------------------------------------------
    it('getNeighborhood returns correct inbound and outbound edges', async () => {
        const nodes = [makeNode('A.md'), makeNode('B.md'), makeNode('C.md')];
        const edges = [
            makeEdge('A.md', 'B.md'), // A → B  (B inbound from A)
            makeEdge('C.md', 'B.md'), // C → B  (B inbound from C)
            makeEdge('B.md', 'C.md'), // B → C  (B outbound to C)
        ];

        await repo.saveGraph(makeGraph(nodes, edges));

        const neighborhood = await repo.getNeighborhood('B.md');

        expect(neighborhood.inbound).toHaveLength(2);
        expect(neighborhood.outbound).toHaveLength(1);

        expect(neighborhood.inbound).toContainEqual(makeEdge('A.md', 'B.md'));
        expect(neighborhood.inbound).toContainEqual(makeEdge('C.md', 'B.md'));
        expect(neighborhood.outbound).toContainEqual(makeEdge('B.md', 'C.md'));

        // Internal `key` must not leak
        for (const edge of [...neighborhood.inbound, ...neighborhood.outbound]) {
            expect(edge).not.toHaveProperty('key');
        }
    });

    // -------------------------------------------------------------------------
    // 11. Neighborhood retrieval — performance (< 5 ms target)
    // -------------------------------------------------------------------------
    it('getNeighborhood retrieves a 1-hop neighborhood in < 5 ms on average', async () => {
        const hub = 'hub.md';
        const nodes: GraphNode[] = [makeNode(hub)];
        const edges: GraphEdge[] = [];

        // 50 spoke nodes, each with inbound + outbound to hub, plus lateral noise
        for (let i = 0; i < 50; i++) {
            const spoke = `node-${i}.md`;
            nodes.push(makeNode(spoke));
            edges.push(makeEdge(hub, spoke));  // hub → spoke (outbound)
            edges.push(makeEdge(spoke, hub));  // spoke → hub (inbound)
            if (i > 0) {
                edges.push(makeEdge(`node-${i - 1}.md`, spoke)); // lateral noise
            }
        }

        await repo.saveGraph(makeGraph(nodes, edges));

        const iterations = 30;
        let total = 0;
        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            await repo.getNeighborhood(hub);
            total += performance.now() - start;
        }

        const average = total / iterations;
        console.log(
            `[MD-201 perf] getNeighborhood avg over ${iterations} iters: ${average.toFixed(3)} ms`,
        );

        expect(average).toBeLessThan(5);
    });

    // -------------------------------------------------------------------------
    // 12. File metadata — MD-202 readiness
    // -------------------------------------------------------------------------
    it('stores and retrieves per-file metadata via updateNode', async () => {
        await repo.saveGraph(makeGraph([makeNode('A.md')], []));

        await repo.updateNode('A.md', makeNode('A.md'), undefined, {
            id: 'A.md',
            hash: 'abc123',
            lastModified: 42000,
        });

        const meta = await repo.getFileMetadata('A.md');
        expect(meta).toMatchObject({ id: 'A.md', hash: 'abc123', lastModified: 42000 });
    });

    // -------------------------------------------------------------------------
    // 13. Fresh database returns empty graph
    // -------------------------------------------------------------------------
    it('loadGraph returns an empty graph on a freshly cleared database', async () => {
        const { graph, vaultMetadata } = await repo.loadGraph();

        expect(graph.nodes.size).toBe(0);
        expect(graph.edges).toHaveLength(0);
        expect(vaultMetadata).toEqual({});
    });
});
