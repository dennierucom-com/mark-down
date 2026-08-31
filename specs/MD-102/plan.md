# Technical Implementation Plan

1. **Graph Model**: Define `GraphNode` and `GraphEdge` interfaces in `src/types/graph.ts`.
2. **Indexer Service**: Create `src/utils/indexer.ts` which takes an array of `MarkdownFile`s.
   - For each file, create a node.
   - Run `parseMarkdownLinks` from `MD-101` (linkExtractor.ts) to find edges.
   - For targets not in the vault, create phantom nodes with `unresolved = true`.
   - Compute `inboundLinks` count based on all incoming edges.
3. **Data Upstream**: Add `lastModified` to `MarkdownFile` interface and capture it via `useFileActions.ts`.
