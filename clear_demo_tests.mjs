import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const db = new DatabaseSync(path.join(process.cwd(), 'local.db'));

try {
  // Clear attempts first
  db.exec('DELETE FROM attempts');
  // Clear exam enrollments
  db.exec('DELETE FROM exam_enrollments');
  // Clear exam instances
  db.exec('DELETE FROM exam_instances');
  // Clear test modules
  db.exec('DELETE FROM test_modules');
  // Clear tests
  db.exec('DELETE FROM tests');
  
  console.log('Successfully removed all demo tests, modules, instances, enrollments, and attempts from the database.');
} catch (e) {
  console.error('Error clearing demo data:', e.message);
}
