import { db } from '@/lib/data/local/db';

export default async function QueueBadge() {
  const centerId = 'mock-center-id';
  
  // Try counting from attempts if the table structure is complete
  try {
    const row = db.prepare(`
      SELECT count(*) as count
      FROM attempts a
      JOIN users u ON a.student_id = u.id
      JOIN center_students cs ON u.id = cs.student_id
      WHERE cs.center_id = ? AND a.status = 'submitted'
    `).get(centerId) as any;

    const count = row?.count || 0;

    if (count === 0) return null;

    return (
      <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
        {count}
      </span>
    );
  } catch (e) {
    return null;
  }
}
