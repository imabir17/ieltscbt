import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Default to a file in the project root
const DB_FILE = process.env.DB_FILE || path.join(process.cwd(), 'local.db');

export const db = new Database(DB_FILE);
db.pragma('journal_mode = WAL');

// Initialize schema if the database is new or schema has changed.
// better-sqlite3 is synchronous, so this happens immediately.
const schemaPath = path.join(process.cwd(), 'src/lib/data/local/schema.sql');
if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
} else {
  console.warn(`Schema file not found at ${schemaPath}`);
}
