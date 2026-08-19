'use client';

import { useActionState, useState } from 'react';
import { assignExamAction } from '@/app/actions/center';
import { AlertCircle, Send } from 'lucide-react';

export default function AssignExamForm({ tests, students }: { tests: any[], students: any[] }) {
  const [state, action, isPending] = useActionState(assignExamAction, null);

  if (tests.length === 0) {
    return <div className="text-slate-500 text-sm">No tests available in the Global Bank.</div>;
  }

  if (students.length === 0) {
    return <div className="text-slate-500 text-sm">Please add students to your center first.</div>;
  }

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {state?.success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">
          Exam assigned successfully!
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Select Test</label>
        <select name="testId" required className="input-field py-2 w-full">
          <option value="">-- Choose a Test --</option>
          {tests.map(t => (
            <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Select Students</label>
        <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto bg-white p-2 space-y-1">
          {students.map(s => (
            <label key={s.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded cursor-pointer">
              <input type="checkbox" name="studentIds" value={s.id} className="w-4 h-4 text-primary-600 rounded border-slate-300" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900">{s.name}</span>
                <span className="text-xs text-slate-500">{s.email}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={isPending} className="btn-primary w-full py-2.5 mt-2 flex items-center justify-center gap-2 disabled:opacity-70">
        <Send size={18} /> {isPending ? 'Assigning...' : 'Assign to Students'}
      </button>
    </form>
  );
}
