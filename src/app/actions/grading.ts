'use server';

import { db } from '@/lib/data/local/db';
import { revalidatePath } from 'next/cache';

export async function submitEvaluationAction(attemptId: string, score: string) {
  try {
    const stmt = db.prepare(`
      UPDATE attempts 
      SET status = 'graded'
      WHERE id = ?
    `);
    stmt.run(attemptId);

    // Save the score into 'scores' table or add to 'attempts'
    // For simplicity, let's just make sure status goes to 'graded'.
    // If you want to store the overall score, we should alter attempts:
    try {
      db.exec('ALTER TABLE attempts ADD COLUMN overall_score TEXT');
    } catch(e) {}
    
    db.prepare(`
      UPDATE attempts 
      SET overall_score = ?
      WHERE id = ?
    `).run(score, attemptId);

    revalidatePath('/center/grading');
    revalidatePath('/student/dashboard');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}
