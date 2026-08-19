import { BookOpen, User, ArrowRight } from 'lucide-react';
import { getSession } from '@/lib/auth/session';
import Link from 'next/link';

export default async function JoinExamPage({ params }: { params: Promise<{ code: string }> }) {
  const session = { email: 'student@email.com', role: 'student', userId: 'student-id' };
  const resolvedParams = await params;
  const code = resolvedParams.code;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full glass rounded-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-primary-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 backdrop-blur-md mb-4 text-white">
            <BookOpen size={32} />
          </div>
          <h1 className="text-2xl font-bold">Elite English Academy</h1>
          <p className="text-primary-100 mt-2 text-sm">You've been invited to take a mock exam.</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-lg font-bold text-slate-900 text-center mb-6">IELTS Academic Mock Test - Final Prep</h2>
          
          {!session ? (
            <div className="text-center space-y-4">
              <p className="text-slate-600 text-sm mb-6">You need to log in to your MockPrep account to join this exam.</p>
              <Link href={`/login?callbackUrl=/exam/${code}`} className="btn-primary w-full flex justify-center py-2.5">
                Log In
              </Link>
              <p className="text-sm text-slate-500">
                New here? <Link href="/signup" className="text-primary-600 hover:underline">Create an account</Link>
              </p>
            </div>
          ) : (
            <form className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">Logged in as</p>
                  <p className="text-sm text-slate-500 truncate">{session.email}</p>
                </div>
                <Link href={`/login?callbackUrl=/exam/${code}`} className="text-xs text-primary-600 font-medium hover:underline">Change</Link>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="rollNumber">
                  Roll / ID Number <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-2">Required by Elite English Academy for identification.</p>
                <input 
                  id="rollNumber" 
                  name="rollNumber" 
                  type="text" 
                  required 
                  className="input-field" 
                  placeholder="e.g. EEA-2024-001"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-4 text-sm text-blue-800">
                <strong>Note:</strong> Joining this exam is free for you. It does not consume your personal credits.
              </div>

              <button type="submit" className="btn-primary w-full text-lg mt-6 py-3 flex items-center justify-center gap-2">
                Join Exam <ArrowRight size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
