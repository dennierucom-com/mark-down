import { openDB, type IDBPDatabase } from 'idb';
import type { GraphNode, GraphEdge } from '../types/graph';

// ---------------------------------------------------------------------------
// Schema types
// ---------------------------------------------------------------------------

export interface VaultMetadata {
    id: 'vault';
    lastIndexed: number;
    [key: string]: unknown;
}

export interface FileMetadata {
    /** File path — doubles as the primary key in the metadata store */
    id: string;
    hash?: string;
    lastModified?: number;
}

type MetadataRecord = VaultMetadata | FileMetadata;

/** Internal edge record — stores the autoIncrement key alongside edge data */
export interface EdgeRecord extends GraphEdge {
    key?: number;
}

export interface GraphDB {
    nodes: {
        key: string;
        value: GraphNode;
        indexes: Record<string, never>;
    };
    edges: {
        key: number;
        value: EdgeRecord;
        indexes: {
            'by-source': string;
            'by-target': string;
        };
    };
    metadata: {
        key: string;
        value: MetadataRecord;
        indexes: Record<string, never>;
    };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DB_NAME = 'mark-south-graph';
export const DB_VERSION = 1;

// ---------------------------------------------------------------------------
// openDatabase
// ---------------------------------------------------------------------------

/**
 * Opens (or upgrades) the IndexedDB database.
 *
 * Schema versioning uses a switch-fallthrough pattern so future versions
 * can add migrations without destroying existing stores.
 *
 * In test environments, install `fake-indexeddb/auto` before calling this
 * function to replace the global `indexedDB` with an in-memory implementation.
 */
export async function openDatabase(): Promise<IDBPDatabase<GraphDB>> {
    return openDB<GraphDB>(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion) {
            // Migrations are additive — fall through from oldVersion to current
            switch (oldVersion) {
                case 0: {
                    // v0 → v1: create all initial stores
                    const nodesStore = db.createObjectStore('nodes', { keyPath: 'id' });
                    void nodesStore; // PK-only lookups, no extra indexes needed

                    const edgesStore = db.createObjectStore('edges', {
                        autoIncrement: true,
                        keyPath: 'key',
                    });
                    // Indexes to support O(k) 1-hop neighborhood retrieval
                    edgesStore.createIndex('by-source', 'source', { unique: false });
                    edgesStore.createIndex('by-target', 'target', { unique: false });

                    db.createObjectStore('metadata', { keyPath: 'id' });
                    break;
                }
                // Future versions: add `case 1:` blocks here without touching case 0
            }
        },
    });
}
