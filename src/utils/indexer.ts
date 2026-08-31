import { MarkdownFile } from '../context/FileContext';
import { parseMarkdownLinks } from './linkExtractor';
import { GraphNode, GraphEdge, AdjacencyGraph } from '../types/graph';

export async function buildAdjacencyGraph(files: MarkdownFile[]): Promise<AdjacencyGraph> {
    const nodes = new Map<string, GraphNode>();
    const edges: GraphEdge[] = [];

    // 1. Initial pass: Create nodes for all actual files
    for (const file of files) {
        // Fallback name if path is undefined
        const path = file.path || file.name;
        
        nodes.set(path, {
            id: path,
            label: file.name,
            path: path,
            inboundLinks: 0,
            lastModified: file.lastModified || Date.now(),
            unresolved: false
        });
    }

    // 2. Second pass: Extract links and create edges
    for (const file of files) {
        const sourcePath = file.path || file.name;
        const links = parseMarkdownLinks(file.content, sourcePath);

        for (const link of links) {
            let targetPath = link.target;
            if (link.linkType === 'wiki' && !targetPath.toLowerCase().endsWith('.md')) {
                targetPath += '.md';
            }

            // Handle unresolved/missing targets
            if (!nodes.has(targetPath) && link.linkType !== 'external') {
                nodes.set(targetPath, {
                    id: targetPath,
                    label: targetPath.split('/').pop() || targetPath,
                    path: targetPath,
                    inboundLinks: 0,
                    lastModified: 0, // Unresolved node
                    unresolved: true
                });
            }

            // Create edge
            edges.push({
                source: sourcePath,
                target: targetPath,
                linkType: link.linkType,
                anchor: link.anchor
            });

            // Increment inbound links for target
            if (link.linkType !== 'external') {
                const targetNode = nodes.get(targetPath);
                if (targetNode) {
                    targetNode.inboundLinks += 1;
                }
            }
        }
    }

    return {
        nodes,
        edges
    };
}
