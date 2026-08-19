'use server';

import { db } from '@/lib/data/local/db';
import { revalidatePath } from 'next/cache';

export async function submitTestAttempt(attemptId: string) {
  try {
    // 1. Mark as submitted (or "grading" since writing needs to be graded)
    // For Reading and Listening, we can mock random scores here.
    const mockReadingScore = 6.5;
    const mockListeningScore = 7.0;

    const stmt = db.prepare(`
      UPDATE attempts 
      SET status = 'submitted', 
          submitted_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(attemptId);

    // Ensure we can see it on the student dashboard and center dashboard
    revalidatePath('/student/dashboard');
    revalidatePath('/center/grading');
    
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
