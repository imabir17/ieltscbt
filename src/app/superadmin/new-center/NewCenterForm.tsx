'use client';

import { provisionCenterAction } from '@/app/actions/superadmin';
import { useActionState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';
// Note: In a real app we'd fetch plans server-side and pass as props to the client form, 
// but for simplicity in this mock Phase we will just fetch them inside a parent server component or assume.
// Actually, let's just make this a client component that takes plans as a prop.

export default function NewCenterForm({ plans }: { plans: { id: string, name: string }[] }) {
  const [state, action, isPending] = useActionState(provisionCenterAction, null);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/superadmin" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="glass rounded-xl p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Provision New Center</h1>
        <p className="text-slate-500 mb-8">This will create a new Center account and automatically generate the Center Admin user credentials.</p>

        {state?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            {state.error}
          </div>
        )}

        <form action={action} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="name">
              Center Name
            </label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              required 
              className="input-field" 
              placeholder="e.g. Elite English Academy"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="planId">
              Select Subscription Plan
            </label>
            <select id="planId" name="planId" required className="input-field">
              <option value="">-- Choose a Plan --</option>
              {plans.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Center Admin Credentials</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="email">
                  Admin Email
                </label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  className="input-field" 
                  placeholder="admin@center.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1" htmlFor="password">
                  Initial Password
                </label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  className="input-field" 
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 mt-4 flex justify-end">
            <button type="submit" disabled={isPending} className="btn-primary w-full md:w-auto px-8 py-3 disabled:opacity-70 disabled:cursor-not-allowed">
              {isPending ? 'Provisioning...' : 'Provision Center'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
