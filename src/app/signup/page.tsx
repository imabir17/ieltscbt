'use client';

import { signupStudent } from '@/app/actions/auth';
import Link from 'next/link';
import { Award, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { useActionState } from 'react';

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signupStudent, null);
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      
      {/* Left side - Pitch */}
      <div className="w-full md:w-1/2 bg-primary-900 text-white p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500 rounded-full blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 max-w-lg mx-auto md:mx-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Master the CBT IELTS with Confidence
          </h1>
          <p className="text-primary-100 text-lg md:text-xl mb-12">
            Experience the exact test environment, get real teacher feedback, and track your band score progression.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary-800 p-3 rounded-xl text-accent-400 mt-1">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-xl">3 Free Full Mock Tests</h3>
                <p className="text-primary-200 mt-1">Start immediately, no credit card required.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary-800 p-3 rounded-xl text-accent-400 mt-1">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Realistic CBT Engine</h3>
                <p className="text-primary-200 mt-1">Identical UI to the official British Council / IDP test.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-primary-800 p-3 rounded-xl text-accent-400 mt-1">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Teacher Evaluation</h3>
                <p className="text-primary-200 mt-1">Writing and Speaking scored by certified IELTS trainers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Create your account</h2>
            <p className="text-slate-500 mt-2">Claim your 3 free mock tests today.</p>
          </div>

          {state?.error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 text-sm">
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
                placeholder="Create a strong password"
              />
            </div>
            
            <button type="submit" disabled={isPending} className="btn-primary w-full text-lg mt-4 h-12 disabled:opacity-70 disabled:cursor-not-allowed">
              {isPending ? 'Signing Up...' : 'Sign Up for Free'}
            </button>
          </form>
          
          <p className="text-center text-slate-500 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-600 font-semibold hover:underline">
              Log in
            </Link>
          </p>
          
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-400">
              Are you a Coaching Center? <Link href="/#centers" className="text-slate-600 hover:underline">Learn about our B2B plans</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
