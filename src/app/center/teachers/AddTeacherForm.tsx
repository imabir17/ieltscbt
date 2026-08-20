'use client';

import { addTeacherAction } from '@/app/actions/center';
import { useActionState } from 'react';
import { AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';

export default function AddTeacherForm({ centerId }: { centerId: string }) {
  const [state, action, isPending] = useActionState(addTeacherAction, null);

  return (
    <div className="glass rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-white">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <UserPlus size={20} className="text-primary-600" />
          Add New Teacher
        </h2>
        <p className="text-sm text-slate-500 mt-1">Teachers can access the evaluator queue to score written and spoken exams.</p>
      </div>
      
      <div className="p-6">
        {state?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm font-medium">
            <AlertCircle size={18} />
            {state.error}
          </div>
        )}
        
        {state?.success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 size={18} />
            Teacher added successfully!
          </div>
        )}

        <form action={action} className="space-y-4">
          <input type="hidden" name="centerId" value={centerId} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Full Name</label>
              <input name="name" type="text" required className="input-field" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Email Address</label>
              <input name="email" type="email" required className="input-field" placeholder="john@example.com" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1">Temporary Password</label>
            <input name="password" type="text" className="input-field" placeholder="123456" defaultValue="123456" />
            <p className="text-xs text-slate-500 mt-1">They can change this after logging in.</p>
          </div>

          <div className="pt-2">
            <button type="submit" disabled={isPending} className="btn-primary w-full sm:w-auto px-6 py-2.5">
              {isPending ? 'Adding...' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
