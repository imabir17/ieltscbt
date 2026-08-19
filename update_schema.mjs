import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'local.db');
const db = new DatabaseSync(DB_FILE);

try {
  db.exec('ALTER TABLE users ADD COLUMN name TEXT DEFAULT "Student"');
  console.log('Added name column to users table.');
} catch (e) {
  console.log('Column name might already exist:', e.message);
}

try {
  db.exec('ALTER TABLE users ADD COLUMN phone TEXT');
  console.log('Added phone column to users table.');
} catch (e) {
  console.log('Column phone might already exist:', e.message);
}
