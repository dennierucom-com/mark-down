# MD-201 — Tasks

## US-01: Database Initialization
- [x] Create `src/repository/database.ts` with `openDatabase()` and schema types
- [x] Implement versioned schema with switch-fallthrough upgrade handler

## US-02 & US-03: Save / Load Graph
- [x] Implement `saveGraph()` with atomic single transaction across nodes/edges/metadata
- [x] Implement `loadGraph()` restoring AdjacencyGraph and vault metadata
- [x] Strip internal `key` field from returned edges

## US-04: Update Single Node
- [x] Implement `updateNode(filePath, node, nodeEdges?, fileMeta?)` in single transaction

## US-05: Clear Database
- [x] Implement `clear()` clearing all three stores in one transaction

## US-06: Neighborhood Retrieval
- [x] Add `by-source` and `by-target` indexes on edges store
- [x] Implement `getNeighborhood(nodeId)` using index range queries
- [x] Performance-test: verified average < 1.1 ms (target: < 5 ms)

## US-07: File Metadata
- [x] Implement `getFileMetadata(filePath)` for MD-202 hash lookup

## Testing
- [x] Write 13 tests covering all acceptance criteria
- [x] `npm run test` → 48/48 tests pass
- [x] `npx tsc -b` → 0 errors
- [x] `npm run lint` → pending

## SDD Docs
- [x] `specs/MD-201/spec.md`
- [x] `specs/MD-201/plan.md`
- [x] `specs/MD-201/tasks.md` (this file)
