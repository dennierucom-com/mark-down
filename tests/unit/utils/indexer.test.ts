import { describe, it, expect } from 'vitest';
import { buildAdjacencyGraph } from '../../../src/utils/indexer';
import { MarkdownFile } from '../../../src/context/FileContext';

describe('Vault Dependency & AST Indexer (MD-102)', () => {
    
    it('should build graph for basic relationships', async () => {
        const files: MarkdownFile[] = [
            { name: 'A.md', path: 'A.md', content: '[B](B.md)', lastModified: 1000 },
            { name: 'B.md', path: 'B.md', content: 'content of B', lastModified: 2000 }
        ];

        const graph = await buildAdjacencyGraph(files);

        // Nodes
        expect(graph.nodes.size).toBe(2);
        expect(graph.nodes.get('A.md')).toBeDefined();
        expect(graph.nodes.get('B.md')).toBeDefined();
        
        // Metadata
        expect(graph.nodes.get('A.md')?.inboundLinks).toBe(0);
        expect(graph.nodes.get('B.md')?.inboundLinks).toBe(1);
        expect(graph.nodes.get('A.md')?.lastModified).toBe(1000);
        
        // Edges
        expect(graph.edges.length).toBe(1);
        expect(graph.edges[0]).toEqual({
            source: 'A.md',
            target: 'B.md',
            linkType: 'markdown',
            anchor: undefined
        });
    });

    it('should handle broken relationships (phantom nodes)', async () => {
        const files: MarkdownFile[] = [
            { name: 'A.md', path: 'A.md', content: '[Missing](missing.md)', lastModified: 1000 }
        ];

        const graph = await buildAdjacencyGraph(files);

        // Nodes: should have created a phantom node for missing.md
        expect(graph.nodes.size).toBe(2);
        
        const missingNode = graph.nodes.get('missing.md');
        expect(missingNode).toBeDefined();
        expect(missingNode?.unresolved).toBe(true);
        expect(missingNode?.inboundLinks).toBe(1);

        // Edges
        expect(graph.edges.length).toBe(1);
        expect(graph.edges[0]).toMatchObject({
            source: 'A.md',
            target: 'missing.md',
            linkType: 'markdown'
        });
    });

    it('should handle anchored relationships', async () => {
        const files: MarkdownFile[] = [
            { name: 'A.md', path: 'A.md', content: '[B section](B.md#heading)' },
            { name: 'B.md', path: 'B.md', content: '# heading' }
        ];

        const graph = await buildAdjacencyGraph(files);
        
        expect(graph.edges.length).toBe(1);
        expect(graph.edges[0]).toMatchObject({
            source: 'A.md',
            target: 'B.md',
            anchor: 'heading'
        });
    });

    it('should handle WikiLinks', async () => {
        const files: MarkdownFile[] = [
            { name: 'A.md', path: 'A.md', content: '[[B]]' },
            { name: 'B.md', path: 'B.md', content: '' }
        ];

        const graph = await buildAdjacencyGraph(files);
        
        expect(graph.edges.length).toBe(1);
        expect(graph.edges[0]).toMatchObject({
            source: 'A.md',
            target: 'B.md',
            linkType: 'wiki'
        });
    });

    it('should handle broken WikiLinks', async () => {
        const files: MarkdownFile[] = [
            { name: 'A.md', path: 'A.md', content: '[[Missing Wiki]]' }
        ];

        const graph = await buildAdjacencyGraph(files);
        
        const missingNode = graph.nodes.get('Missing Wiki.md');
        expect(missingNode).toBeDefined();
        expect(missingNode?.unresolved).toBe(true);
        
        expect(graph.edges.length).toBe(1);
        expect(graph.edges[0]).toMatchObject({
            source: 'A.md',
            target: 'Missing Wiki.md',
            linkType: 'wiki'
        });
    });
});
