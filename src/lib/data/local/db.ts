import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

// Default to a file in the project root
const DB_FILE = process.env.DB_FILE || path.join(process.cwd(), 'local.db');

declare global {
  var __db: any | undefined;
}

if (!globalThis.__db) {
  globalThis.__db = new DatabaseSync(DB_FILE);
  globalThis.__db.exec('PRAGMA journal_mode = WAL');
  globalThis.__db.exec('PRAGMA busy_timeout = 5000');
  
  // Polyfill transaction method since node:sqlite does not have a wrapper yet
  globalThis.__db.transaction = (fn: any) => {
    return (...args: any[]) => {
      globalThis.__db.exec('BEGIN TRANSACTION');
      try {
        const result = fn(...args);
        globalThis.__db.exec('COMMIT');
        return result;
      } catch (err) {
        globalThis.__db.exec('ROLLBACK');
        throw err;
      }
    };
  };

  // Initialize schema if the database is new or schema has changed.
  const schemaPath = path.join(process.cwd(), 'src/lib/data/local/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    globalThis.__db.exec(schema);
  } else {
    console.warn(`Schema file not found at ${schemaPath}`);
  }
}

export const db = globalThis.__db;
