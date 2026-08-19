'use server';

import { repo } from '@/lib/data/local';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPlan(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const quotaStr = formData.get('quota') as string;
  const priceStr = formData.get('price') as string;
  const overageStr = formData.get('overage') as string;

  if (!name || !quotaStr || !priceStr) {
    return { error: 'Name, Quota, and Price are required.' };
  }

  const quota = parseInt(quotaStr, 10);
  const price = parseFloat(priceStr);
  const overage = overageStr ? parseFloat(overageStr) : null;

  if (isNaN(quota) || isNaN(price)) {
    return { error: 'Quota and Price must be valid numbers.' };
  }

  try {
    await repo.createPlan({
      name,
      monthly_exam_quota: quota,
      price,
      overage_fee_per_exam: overage,
      features: JSON.stringify(['Mock Feature 1', 'Mock Feature 2']) // Simplified for now
    });
  } catch (err) {
    return { error: 'Failed to create plan.' };
  }

  revalidatePath('/superadmin/plans');
  redirect('/superadmin/plans');
}

import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth/session';

export async function provisionCenterAction(prevState: any, formData: FormData) {
  const session = { userId: 'superadmin-1', role: 'superadmin' };

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const planId = formData.get('planId') as string;

  if (!name || !email || !password || !planId) {
    return { error: 'All fields are required.' };
  }

  const existingUser = await repo.getUserByEmail(email);
  if (existingUser) {
    return { error: 'A user with this email already exists.' };
  }

  const logoUrl = formData.get('logoUrl') as string || '';

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const center = await repo.provisionCenter(name, planId, email, passwordHash, session.userId);
    
    // Update logo_url if provided
    if (logoUrl) {
      import('@/lib/data/local/db').then(({ db }) => {
        db.prepare('UPDATE centers SET logo_url = ? WHERE id = ?').run(logoUrl, center.id);
      });
    }
  } catch (err) {
    console.error(err);
    return { error: 'Failed to provision center.' };
  }

  revalidatePath('/superadmin');
  redirect('/superadmin');
}

export async function createGlobalTestAction(prevState: any, formData: FormData) {
  const session = { userId: 'superadmin-1', role: 'superadmin' };

  const name = formData.get('name') as string;
  const type = formData.get('type') as 'Academic' | 'General';

  if (!name || !type) {
    return { error: 'Name and type are required.' };
  }

  let testId;
  try {
    const test = await repo.createTest({
      owner_center_id: null,
      name,
      type,
      status: 'draft'
    });
    testId = test.id;
  } catch (err) {
    console.error(err);
    return { error: 'Failed to create test.' };
  }

  revalidatePath('/superadmin/bank');
  // Redirect to the test builder page
  redirect(`/superadmin/bank/${testId}/edit`);
}

export async function deleteGlobalTestAction(prevState: any, formData: FormData) {
  const session = { userId: 'superadmin-1', role: 'superadmin' };

  const testId = formData.get('testId') as string;
  if (!testId) {
    return { error: 'Test ID is required' };
  }

  try {
    await repo.deleteTest(testId);
  } catch (err) {
    console.error(err);
    return { error: 'Failed to delete test.' };
  }

  revalidatePath('/superadmin/bank');
  redirect('/superadmin/bank');
}

export async function saveTestModulesAction(prevState: any, formData: FormData) {
  const session = { userId: 'superadmin-1', role: 'superadmin' };

  const testId = formData.get('testId') as string;
  const modulesDataStr = formData.get('modulesData') as string;

  if (!testId || !modulesDataStr) {
    return { error: 'Missing data' };
  }

  try {
    const modulesData = JSON.parse(modulesDataStr);
    
    // Wipe existing modules for this test to perform a full overwrite
    await repo.deleteTestModulesByTestId(testId);

    // Save Listening
    if (modulesData.listening) {
      await repo.createTestModule({
        test_id: testId,
        module_type: 'listening',
        config: JSON.stringify(modulesData.listening.config),
        questions: JSON.stringify(modulesData.listening.questions)
      });
    }

    // Save Reading
    if (modulesData.reading) {
      await repo.createTestModule({
        test_id: testId,
        module_type: 'reading',
        config: JSON.stringify(modulesData.reading.config),
        questions: JSON.stringify(modulesData.reading.questions)
      });
    }

    // Save Writing
    if (modulesData.writing) {
      await repo.createTestModule({
        test_id: testId,
        module_type: 'writing',
        config: JSON.stringify(modulesData.writing.config),
        questions: JSON.stringify(modulesData.writing.questions)
      });
    }
    
    revalidatePath(`/superadmin/bank/${testId}/edit`);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { error: 'Failed to save test modules.' };
  }
}
