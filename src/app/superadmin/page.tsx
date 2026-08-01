import { Plus, Search, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { repo } from '@/lib/data/local';

export default async function SuperadminCentersPage() {
  const centers = await repo.getCenters();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Coaching Centers</h2>
          <p className="text-slate-500 mt-1">Manage B2B center accounts and subscriptions.</p>
        </div>
        <Link href="/superadmin/new-center" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          New Center
        </Link>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search centers..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white">
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="px-6 py-4 font-semibold">Center Name</th>
              <th className="px-6 py-4 font-semibold">Admin Email</th>
              <th className="px-6 py-4 font-semibold">Plan</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {centers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No centers provisioned yet.
                </td>
              </tr>
            ) : (
              centers.map(center => (
                <tr key={center.id} className="hover:bg-slate-50 transition-colors group bg-white">
                  <td className="px-6 py-4 font-bold text-slate-900">{center.name}</td>
                  <td className="px-6 py-4 text-slate-500">{center.admin_email || 'No Admin'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      {center.plan_name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${center.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      <span className="text-slate-700 capitalize font-medium">{center.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
