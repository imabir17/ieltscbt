import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const db = new DatabaseSync(path.join(process.cwd(), 'local.db'));

try {
  // Get the most recent real center
  const center = db.prepare('SELECT id FROM centers ORDER BY created_at DESC LIMIT 1').get();
  
  if (center) {
    db.prepare(`UPDATE center_students SET center_id = ? WHERE center_id = 'mock-center-id'`).run(center.id);
    db.prepare(`UPDATE tests SET owner_center_id = ? WHERE owner_center_id = 'mock-center-id'`).run(center.id);
    console.log('Fixed orphaned center_students linking to:', center.id);
  } else {
    console.log('No real center found in DB.');
  }
} catch (e) {
  console.log('Error:', e.message);
}
