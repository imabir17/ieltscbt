import { Plus, Search, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import { repo } from '@/lib/data/local';

export default async function GlobalBankPage() {
  const tests = await repo.getGlobalTests();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Global Question Bank</h2>
          <p className="text-slate-500 mt-1">Tests published here are accessible to all centers and self-serve students.</p>
        </div>
        <Link href="/superadmin/bank/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Create Test
        </Link>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search global tests..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        
        {tests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-slate-400">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No Tests Published</h3>
            <p>Create a test and publish it to the global bank.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="px-6 py-4 font-semibold">Test Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tests.map(test => (
                <tr key={test.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{test.name}</td>
                  <td className="px-6 py-4 text-slate-500">{test.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${test.status === 'published' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/superadmin/bank/${test.id}/edit`} className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-transparent hover:border-primary-200">
                      <Settings size={16} />
                      Builder
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
