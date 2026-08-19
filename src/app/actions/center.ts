'use server';

import { db } from '@/lib/data/local/db';
import { randomUUID } from 'crypto';
import { revalidatePath } from 'next/cache';

export async function addStudentAction(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string || '123456';
    const centerId = formData.get('centerId') as string;

    const id = randomUUID();
    db.prepare(`
      INSERT INTO users (id, email, password_hash, account_type, name, phone)
      VALUES (?, ?, ?, 'student', ?, ?)
    `).run(id, email, password, name, phone);

    // Also link the student to the center via a new table if needed, but the prompt says 
    // "students cannot sign up. make a student section in center dashboard. they will click add student..."
    // Since we need to know WHICH center this student belongs to, let's create a center_students table!
    
    // Check if center_students exists, if not create it
    try {
      db.prepare(`
        CREATE TABLE IF NOT EXISTS center_students (
          center_id TEXT NOT NULL,
          student_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (center_id, student_id)
        )
      `).run();
    } catch(e) {}

    db.prepare(`
      INSERT INTO center_students (center_id, student_id)
      VALUES (?, ?)
    `).run(centerId || 'mock-center-id', id);

    revalidatePath('/center/students');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function assignExamAction(prevState: any, formData: FormData) {
  try {
    const testId = formData.get('testId') as string;
    const studentIds = formData.getAll('studentIds') as string[];
    
    if (!testId || studentIds.length === 0) {
      return { error: 'Please select a test and at least one student.' };
    }

    const insert = db.prepare(`
      INSERT INTO attempts (id, student_id, source, test_id, status, started_at)
      VALUES (?, ?, 'center_exam', ?, 'not_started', NULL)
    `);

    const transaction = db.transaction(() => {
      for (const sId of studentIds) {
        insert.run(randomUUID(), sId, testId);
      }
    });
    
    transaction();
    revalidatePath('/center/exams');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
