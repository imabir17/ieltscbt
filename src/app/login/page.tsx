'use client';

import { login } from '@/app/actions/auth';
import Link from 'next/link';
import { BookOpen, AlertCircle } from 'lucide-react';
import { useActionState } from 'react';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, null);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 to-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary-500/30 mb-4">
            <BookOpen size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Log in to your account</p>
        </div>

        <div className="glass rounded-2xl p-8">
          {state?.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} />
              {state.error}
            </div>
          )}
          <form action={action} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="input-field" 
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="input-field" 
                placeholder="••••••••"
              />
            </div>
            
            <button type="submit" disabled={isPending} className="btn-primary w-full text-lg mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isPending ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        <p className="text-center text-slate-500 mt-8">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary-600 font-semibold hover:underline">
            Sign up for free mocks
          </Link>
        </p>
      </div>
    </div>
  );
}
