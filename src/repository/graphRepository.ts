import type { IDBPDatabase } from 'idb';
import type { AdjacencyGraph, GraphEdge, GraphNode } from '../types/graph';
import {
    DB_NAME,
    openDatabase,
    type EdgeRecord,
    type FileMetadata,
    type GraphDB,
    type VaultMetadata,
} from './database';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return a copy of `record` without the `key` property. */
function stripKey(record: EdgeRecord): GraphEdge {
    const copy = { ...record } as GraphEdge & { key?: number };
    delete copy.key;
    return copy as GraphEdge;
}


// ---------------------------------------------------------------------------
// GraphRepository
// ---------------------------------------------------------------------------

/**
 * Repository for persisting and restoring the adjacency graph using IndexedDB.
 *
 * Designed to be consumed by MD-202's incremental indexer, which reads
 * per-file hashes stored in the `metadata` store to detect changed files.
 *
 * ### Basic usage
 * ```ts
 * const repo = new GraphRepository();
 * await repo.saveGraph(graph);
 * const { graph: restored } = await repo.loadGraph();
 * ```
 *
 * ### Testing
 * Import `fake-indexeddb/auto` at the top of your test file to install an
 * in-memory IndexedDB implementation in the jsdom environment.
 * ```ts
 * import 'fake-indexeddb/auto';
 * ```
 */
export class GraphRepository {
    /**
     * Lazily-initialised DB connection.  The promise is stored so the
     * connection is reused across calls within the same instance.
     */
    private dbPromise: Promise<IDBPDatabase<GraphDB>> | null = null;

    // -----------------------------------------------------------------------
    // Private helpers
    // -----------------------------------------------------------------------

    /** Returns the shared DB connection, opening it on first call. */
    private getDb(): Promise<IDBPDatabase<GraphDB>> {
        if (!this.dbPromise) {
            this.dbPromise = openDatabase();
        }
        return this.dbPromise;
    }

    // -----------------------------------------------------------------------
    // Public API
    // -----------------------------------------------------------------------

    /**
     * Persist the full adjacency graph atomically.
     *
     * All writes to `nodes`, `edges`, and `metadata` occur within a single
     * IndexedDB transaction.  If any write fails, the browser rolls back the
     * entire transaction — the store is never left partially written.
     *
     * @param graph          The in-memory adjacency graph produced by MD-102.
     * @param vaultMetadata  Optional vault-level key/value data to co-persist.
     */
    async saveGraph(
        graph: AdjacencyGraph,
        vaultMetadata: Record<string, unknown> = {},
    ): Promise<void> {
        const db = await this.getDb();

        // Single transaction spanning all three stores
        const tx = db.transaction(['nodes', 'edges', 'metadata'], 'readwrite');
        const nodesStore = tx.objectStore('nodes');
        const edgesStore = tx.objectStore('edges');
        const metaStore  = tx.objectStore('metadata');

        // Clear previous data — makes saveGraph idempotent / fully-replacing
        await nodesStore.clear();
        await edgesStore.clear();

        // Write nodes
        for (const node of graph.nodes.values()) {
            await nodesStore.put(node);
        }

        // Write edges — strip stale `key` so autoIncrement assigns new values
        for (const edge of graph.edges) {
            const record: EdgeRecord = { ...edge };
            delete record.key;
            await edgesStore.add(record);
        }

        // Write vault metadata singleton
        const vaultMeta: VaultMetadata = {
            id: 'vault',
            lastIndexed: Date.now(),
            ...vaultMetadata,
        };
        await metaStore.put(vaultMeta);

        await tx.done;
    }

    /**
     * Restore the persisted adjacency graph.
     *
     * @returns The graph and vault metadata that were last saved, or an
     *          empty graph if nothing has been persisted yet.
     */
    async loadGraph(): Promise<{
        graph: AdjacencyGraph;
        vaultMetadata: Record<string, unknown>;
    }> {
        const db = await this.getDb();

        const tx = db.transaction(['nodes', 'edges', 'metadata'], 'readonly');

        const [rawNodes, rawEdges, rawMeta] = await Promise.all([
            tx.objectStore('nodes').getAll(),
            tx.objectStore('edges').getAll(),
            tx.objectStore('metadata').get('vault'),
        ]);

        await tx.done;

        // Rebuild Map from array
        const nodes = new Map<string, GraphNode>(rawNodes.map((n) => [n.id, n]));

        // Strip internal `key` field before returning edges to callers
        const edges: GraphEdge[] = rawEdges.map(stripKey);

        // Extract vault metadata, omitting internal fields
        const rawVault = (rawMeta as VaultMetadata | undefined) ?? { id: 'vault' as const, lastIndexed: 0 };
        const restMeta: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(rawVault)) {
            if (k !== 'id' && k !== 'lastIndexed') restMeta[k] = v;
        }

        return {
            graph: { nodes, edges },
            vaultMetadata: restMeta,
        };
    }

    /**
     * Update a single node (and optionally its associated edges and file
     * metadata) without rewriting the entire graph.
     *
     * All changes are committed within one transaction.
     *
     * @param filePath   The node ID / file path to update.
     * @param node       New node data.
     * @param nodeEdges  Optional replacement edges for this node (outbound
     *                   edges where `source === filePath`).  Pass `undefined`
     *                   to leave existing edges untouched.
     * @param fileMeta   Optional per-file metadata (e.g. hash) for MD-202.
     */
    async updateNode(
        filePath: string,
        node: GraphNode,
        nodeEdges?: GraphEdge[],
        fileMeta?: FileMetadata,
    ): Promise<void> {
        const db = await this.getDb();

        const needsEdges = nodeEdges !== undefined;
        const needsMeta  = fileMeta !== undefined;

        const storeList: ('nodes' | 'edges' | 'metadata')[] =
            needsEdges || needsMeta
                ? ['nodes', 'edges', 'metadata']
                : ['nodes'];

        const tx = db.transaction(storeList, 'readwrite');
        await tx.objectStore('nodes').put(node);

        if (needsEdges) {
            const edgesStore = tx.objectStore('edges');
            // Remove existing outbound edges for this file
            const existingKeys = await edgesStore
                .index('by-source')
                .getAllKeys(IDBKeyRange.only(filePath));
            for (const key of existingKeys) {
                await edgesStore.delete(key);
            }
            // Write replacement edges
            for (const edge of nodeEdges) {
                const record: EdgeRecord = { ...edge };
                delete record.key;
                await edgesStore.add(record);
            }
        }

        if (needsMeta) {
            await tx.objectStore('metadata').put(fileMeta);
        }

        await tx.done;
    }

    /**
     * Retrieve the 1-hop inbound and outbound neighborhood of a node.
     *
     * Both queries hit the `by-source` / `by-target` indexes, keeping
     * retrieval well under 5 ms for typical vault sizes.
     *
     * @param nodeId  The node ID to query.
     */
    async getNeighborhood(
        nodeId: string,
    ): Promise<{ inbound: GraphEdge[]; outbound: GraphEdge[] }> {
        const db = await this.getDb();

        const tx = db.transaction('edges', 'readonly');
        const edgesStore = tx.objectStore('edges');
        const range = IDBKeyRange.only(nodeId);

        const [outboundRaw, inboundRaw] = await Promise.all([
            edgesStore.index('by-source').getAll(range),
            edgesStore.index('by-target').getAll(range),
        ]);

        await tx.done;

        return {
            outbound: outboundRaw.map(stripKey),
            inbound:  inboundRaw.map(stripKey),
        };
    }

    /**
     * Retrieve per-file metadata stored during indexing (consumed by MD-202).
     *
     * @param filePath  The file path whose metadata to retrieve.
     * @returns         The `FileMetadata` record, or `undefined` if not stored.
     */
    async getFileMetadata(filePath: string): Promise<FileMetadata | undefined> {
        const db = await this.getDb();
        const record = await db.get('metadata', filePath);
        // Guard against accidentally returning the vault singleton
        if (!record || record.id === 'vault') return undefined;
        return record as FileMetadata;
    }

    /**
     * Returns the name of the underlying IndexedDB database.
     */
    getDatabaseName(): string {
        return DB_NAME;
    }

    /**
     * Clear all persisted graph data (nodes, edges, metadata).
     *
     * After calling this, `loadGraph()` will return an empty graph.
     */
    async clear(): Promise<void> {
        const db = await this.getDb();
        const tx = db.transaction(['nodes', 'edges', 'metadata'], 'readwrite');

        await Promise.all([
            tx.objectStore('nodes').clear(),
            tx.objectStore('edges').clear(),
            tx.objectStore('metadata').clear(),
        ]);

        await tx.done;
    }
}
