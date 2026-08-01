'use client';

import { createGlobalTestAction } from '@/app/actions/superadmin';
import { useActionState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NewTestPage() {
  const [state, action, isPending] = useActionState(createGlobalTestAction, null);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/superadmin/bank" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Back to Bank
        </Link>
      </div>

      <div className="glass rounded-xl p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Global Test</h1>
        <p className="text-slate-500 mb-8">This will create a draft test in the Global Bank. You can build the test modules on the next screen.</p>

        {state?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="name">
              Test Name
            </label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              required 
              className="input-field" 
              placeholder="e.g. Cambridge IELTS 18 - Test 1"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="type">
              Test Type
            </label>
            <select id="type" name="type" required className="input-field">
              <option value="Academic">Academic</option>
              <option value="General">General Training</option>
            </select>
          </div>

          <div className="pt-6 mt-4 flex justify-end">
            <button type="submit" disabled={isPending} className="btn-primary w-full md:w-auto px-8 py-3 disabled:opacity-70 disabled:cursor-not-allowed">
              {isPending ? 'Creating...' : 'Create & Build Modules'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
