# MD-201 — IndexedDB Schema & Repository Layer

## Overview

Persist the in-memory adjacency graph produced by MD-102 to IndexedDB so the application can restore graph state without reparsing the entire vault on startup.

## User Stories

### US-01 (P1) — Database Initialization

**As a** developer,  
**I want** the IndexedDB database to be initialized with a versioned schema,  
**So that** future migrations do not destroy existing data.

**Acceptance Scenarios:**

```
Given the application starts for the first time
When the repository is instantiated
Then the database is created with schema version 1
And three object stores exist: nodes, edges, metadata
```

---

### US-02 (P1) — Save Graph

**As a** developer,  
**I want** to persist the full adjacency graph atomically,  
**So that** the stored state is never partially written.

**Acceptance Scenarios:**

```
Given a complete AdjacencyGraph in memory
When saveGraph() is called
Then all nodes, edges, and vault metadata are written within a single transaction
And if any write fails, no partial data is committed
```

---

### US-03 (P1) — Load Graph

**As a** developer,  
**I want** to load a previously persisted graph,  
**So that** the application can restore state without reparsing the vault.

**Acceptance Scenarios:**

```
Given a graph has been persisted via saveGraph()
When loadGraph() is called
Then the returned graph contains all nodes and edges that were saved
And node and edge data exactly matches the persisted data
```

---

### US-04 (P1) — Update Single Node

**As a** developer,  
**I want** to update a single node without rewriting the entire graph,  
**So that** incremental updates are efficient.

**Acceptance Scenarios:**

```
Given a graph is persisted
When updateNode(filePath, data) is called for one node
Then only that node's data is changed in the store
And all other nodes remain unchanged
```

---

### US-05 (P1) — Clear Database

**As a** developer,  
**I want** to clear the entire persisted graph,  
**So that** a full re-index can be triggered cleanly.

**Acceptance Scenarios:**

```
Given a graph is persisted
When clear() is called
Then all nodes, edges, and metadata stores are empty
```

---

### US-06 (P1) — Fast Neighborhood Retrieval

**As a** developer,  
**I want** to retrieve the 1-hop inbound and outbound neighbors of a node in < 5 ms,  
**So that** graph traversal during navigation is fast.

**Acceptance Scenarios:**

```
Given nodes and edges are persisted
When getNeighborhood(nodeId) is called
Then all inbound and outbound edges for that node are returned
And the retrieval completes within 5ms on average
```

---

### US-07 (P2) — File Hash Metadata

**As a** developer,  
**I want** to store per-file hash/checksum data in the metadata store,  
**So that** MD-202 can compare stored hashes with current content hashes.

**Acceptance Scenarios:**

```
Given a file has been indexed
When getFileMetadata(filePath) is called
Then the stored metadata for that file (including hash) is returned
```
