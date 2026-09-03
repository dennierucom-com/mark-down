# MD-201 — Technical Implementation Plan

## Architecture

```
src/
└── repository/
    ├── database.ts         # idb schema + openDatabase helper
    └── graphRepository.ts  # GraphRepository class
```

## Technology

- **`idb`** (v8) — Promise-based IndexedDB wrapper with TypeScript DBSchema support
- **`fake-indexeddb`** (devDependency) — In-memory IndexedDB implementation for Vitest (jsdom environment)

## Database Schema (Version 1)

### Object Stores

| Store      | Key              | Purpose                                        |
|------------|------------------|------------------------------------------------|
| `nodes`    | `id` (keyPath)   | Stores `GraphNode` objects                     |
| `edges`    | autoIncrement    | Stores `GraphEdge` objects (with source/target indexes) |
| `metadata` | `id` (keyPath)   | Vault-level and per-file metadata (hash, path) |

### Indexes

| Store   | Index name | Field    | Notes                                    |
|---------|------------|----------|------------------------------------------|
| `edges` | `by-source`| `source` | For fast outbound neighbor lookup        |
| `edges` | `by-target`| `target` | For fast inbound neighbor lookup         |

The `by-source` and `by-target` indexes allow single index range queries for 1-hop neighborhood retrieval, enabling the `<5ms` performance target.

## Schema Versioning

`openDB` is called with a `version` number. The `upgrade` callback checks the current `oldVersion` to handle incremental migrations in a `switch` fallthrough pattern — so future versions can be added without destroying existing data.

## GraphRepository API

```typescript
class GraphRepository {
    constructor(dbFactory?: IDBFactory)  // allows fake-indexeddb injection in tests
    saveGraph(graph: AdjacencyGraph, vaultMetadata?: Record<string, unknown>): Promise<void>
    loadGraph(): Promise<{ graph: AdjacencyGraph; vaultMetadata: Record<string, unknown> }>
    updateNode(filePath: string, node: GraphNode, nodeEdges?: GraphEdge[], fileMeta?: FileMetadata): Promise<void>
    getNeighborhood(nodeId: string): Promise<{ inbound: GraphEdge[]; outbound: GraphEdge[] }>
    getFileMetadata(filePath: string): Promise<FileMetadata | undefined>
    clear(): Promise<void>
}
```

### Transaction Strategy

- `saveGraph()` uses a single `readwrite` transaction over `['nodes', 'edges', 'metadata']`. All writes occur within one transaction to ensure atomicity. On failure the browser rolls back all writes.
- `updateNode()` uses a single `readwrite` transaction over `['nodes', 'edges', 'metadata']`.
- `loadGraph()` uses a `readonly` transaction.

## Metadata Store Shape

```typescript
interface VaultMetadata {
    id: 'vault';  // fixed singleton key
    lastIndexed: number;
    [key: string]: unknown;
}

interface FileMetadata {
    id: string;  // file path — used by MD-202 for hash comparison
    hash?: string;
    lastModified?: number;
}
```

## Testing Strategy

- Use `fake-indexeddb` injected via `GraphRepository` constructor to avoid real browser IDB in jsdom.
- Tests run entirely in Vitest, no browser required.
- Performance test uses `performance.now()` to measure neighborhood retrieval over 100 iterations and asserts p50 < 5ms.
