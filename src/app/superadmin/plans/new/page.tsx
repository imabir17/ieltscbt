'use client';

import { createPlan } from '@/app/actions/superadmin';
import { useActionState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NewPlanPage() {
  const [state, action, isPending] = useActionState(createPlan, null);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/superadmin/plans" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Back to Plans
        </Link>
      </div>

      <div className="glass rounded-xl p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Create New Plan</h1>

        {state?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="name">
              Plan Name
            </label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              required 
              className="input-field" 
              placeholder="e.g. Starter, Growth, Enterprise"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="quota">
                Monthly Exam Quota
              </label>
              <input 
                id="quota" 
                name="quota" 
                type="number" 
                required 
                min="1"
                className="input-field" 
                placeholder="e.g. 50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="price">
                Monthly Price (৳)
              </label>
              <input 
                id="price" 
                name="price" 
                type="number" 
                required 
                min="0"
                className="input-field" 
                placeholder="e.g. 2500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="overage">
              Overage Fee Per Exam (৳)
            </label>
            <p className="text-xs text-slate-500 mb-2">Leave blank to enforce a "Hard Block" when the quota is reached.</p>
            <input 
              id="overage" 
              name="overage" 
              type="number" 
              min="0"
              className="input-field" 
              placeholder="e.g. 25 or leave blank"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button type="submit" disabled={isPending} className="btn-primary w-full md:w-auto px-8 py-3 disabled:opacity-70 disabled:cursor-not-allowed">
              {isPending ? 'Creating Plan...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
