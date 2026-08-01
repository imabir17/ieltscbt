import { Plus, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { repo } from '@/lib/data/local';

export default async function SuperadminPlansPage() {
  const plans = await repo.getPlans();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Plans & Billing</h2>
          <p className="text-slate-500 mt-1">Manage B2B pricing tiers and overage rules.</p>
        </div>
        <Link href="/superadmin/plans/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
          <p className="text-slate-500">No plans created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="glass rounded-xl p-6 border-t-4 border-t-primary-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900">
                    ৳ {plan.price.toLocaleString()} <span className="text-sm font-normal text-slate-500">/ mo</span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-700">
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Monthly Quota</span>
                  <span className="font-semibold text-slate-900">{plan.monthly_exam_quota} Exams</span>
                </div>
                <div className="flex justify-between">
                  <span>Overage Fee</span>
                  <span className={`font-semibold ${plan.overage_fee_per_exam !== null ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {plan.overage_fee_per_exam !== null ? `৳ ${plan.overage_fee_per_exam} / exam` : 'Hard Block'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
