'use server';

import { repo } from '@/lib/data/local';
import { createSession, deleteSession } from '@/lib/auth/session';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await repo.getUserByEmail(email);
  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    return { error: 'Invalid email or password' };
  }

  let centerId: string | undefined;
  if (user.account_type === 'center_staff') {
    const staff = await repo.getCenterStaffByUserId(user.id);
    if (staff) {
      centerId = staff.center_id;
    }
  }

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.account_type,
    centerId,
  });

  // Redirect based on role
  if (user.account_type === 'superadmin') {
    redirect('/superadmin');
  } else if (user.account_type === 'center_staff') {
    redirect('/center');
  } else {
    redirect('/student/dashboard');
  }
}

export async function signupStudent(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const existing = await repo.getUserByEmail(email);
  if (existing) {
    return { error: 'Email is already in use' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await repo.createStudent({
    email,
    password_hash: passwordHash,
    account_type: 'student',
  });

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.account_type,
  });

  redirect('/student/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
