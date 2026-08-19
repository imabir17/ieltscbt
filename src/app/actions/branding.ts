'use server';

import { db } from '@/lib/data/local/db';

export async function getCenterBranding() {
  try {
    const student = db.prepare(`
      SELECT c.name as center_name, c.logo_url
      FROM users u
      JOIN center_students cs ON u.id = cs.student_id
      JOIN centers c ON cs.center_id = c.id
      WHERE u.account_type = 'student'
      ORDER BY u.created_at DESC LIMIT 1
    `).get() as any;

    if (student) {
      return {
        centerName: student.center_name,
        logoUrl: student.logo_url
      };
    }
  } catch (e) {
    // Ignore errors, fallback below
  }

  return { centerName: 'MockPrep Center', logoUrl: null };
}
