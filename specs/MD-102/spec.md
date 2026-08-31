# Feature Specification: Vault Dependency & AST Indexer

## Requirements
- Create a batch-processing manager that iterates through all Markdown files in a loaded folder/vault.
- Construct the initial in-memory adjacency graph.
- The graph models files as nodes and links between files as edges.
- Unresolved targets (missing files) must still create phantom nodes.

## User Stories
1. **As a user**, when I open a folder of markdown files, I want the system to index the files and extract relationships (links, wiki links) so that I can see an adjacency graph.
2. **As a user**, when I have broken links in my vault, I want the indexer to gracefully create phantom nodes so I can identify missing files.
