import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'local.db');
const db = new DatabaseSync(DB_FILE);

try {
  db.exec('ALTER TABLE centers ADD COLUMN logo_url TEXT DEFAULT ""');
  console.log('Added logo_url column to centers table.');
} catch (e) {
  console.log('Column logo_url might already exist:', e.message);
}
