export interface GraphNode {
    id: string; // File path or unresolved target
    label: string; // File name
    path: string; // Normalized file path
    inboundLinks: number;
    lastModified: number;
    unresolved?: boolean; // True if the file does not exist in the vault
}

export interface GraphEdge {
    source: string; // source node id
    target: string; // target node id
    linkType: 'markdown' | 'wiki' | 'external';
    anchor?: string;
}

export interface AdjacencyGraph {
    nodes: Map<string, GraphNode>;
    edges: GraphEdge[];
}
