'use client';

import { useActionState } from 'react';
import { addStudentAction } from '@/app/actions/center';
import { AlertCircle, Plus } from 'lucide-react';

export default function AddStudentForm({ centerId }: { centerId: string }) {
  const [state, action, isPending] = useActionState(addStudentAction, null);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="centerId" value={centerId} />
      
      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {state?.success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">
          Student successfully added!
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
        <input type="text" name="name" required className="input-field py-2" placeholder="Jane Doe" />
      </div>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
        <input type="email" name="email" required className="input-field py-2" placeholder="jane@example.com" />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
        <input type="tel" name="phone" className="input-field py-2" placeholder="+1 234 567 8900" />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Initial Password</label>
        <input type="text" name="password" required className="input-field py-2 bg-slate-50" defaultValue="123456" />
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-70">
        <Plus size={18} /> {isPending ? 'Adding...' : 'Add Student'}
      </button>
    </form>
  );
}
