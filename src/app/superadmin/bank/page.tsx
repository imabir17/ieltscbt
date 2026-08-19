import { Plus, Search, FileText, Settings, Headphones, BookOpen, PenLine } from 'lucide-react';
import Link from 'next/link';
import { repo } from '@/lib/data/local';
import { DeleteTestButton } from './DeleteTestButton';

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  listening: {
    label: 'Listening',
    icon: <Headphones size={18} />,
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  reading: {
    label: 'Reading',
    icon: <BookOpen size={18} />,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  writing: {
    label: 'Writing',
    icon: <PenLine size={18} />,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
};

export default async function GlobalBankPage() {
  const tests = await repo.getGlobalTests();

  // Group by module_type
  const grouped: Record<string, typeof tests> = {};
  for (const test of tests) {
    const key = test.module_type || 'other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(test);
  }

  const categoryOrder = ['listening', 'reading', 'writing'];
  const sortedCategories = [
    ...categoryOrder.filter(c => grouped[c]),
    ...Object.keys(grouped).filter(c => !categoryOrder.includes(c)),
  ];

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

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {categoryOrder.map(cat => {
          const meta = CATEGORY_META[cat];
          const count = grouped[cat]?.length ?? 0;
          return (
            <div key={cat} className={`flex items-center gap-4 px-5 py-4 rounded-xl border ${meta.border} ${meta.bg}`}>
              <div className={`${meta.color}`}>{meta.icon}</div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{count}</div>
                <div className={`text-sm font-medium ${meta.color}`}>{meta.label} Tests</div>
              </div>
            </div>
          );
        })}
      </div>

      {tests.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center text-slate-500">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4 text-slate-400">
            <FileText size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-1">No Tests Published</h3>
          <p>Create a test and publish it to the global bank.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {sortedCategories.map(cat => {
            const meta = CATEGORY_META[cat] ?? { label: cat, icon: <FileText size={18} />, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' };
            const catTests = grouped[cat];
            return (
              <div key={cat} className="glass rounded-xl overflow-hidden">
                {/* Category Header */}
                <div className={`flex items-center gap-3 px-6 py-4 border-b ${meta.border} ${meta.bg}`}>
                  <span className={meta.color}>{meta.icon}</span>
                  <h3 className={`font-bold text-[15px] ${meta.color}`}>{meta.label}</h3>
                  <span className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full border ${meta.border} ${meta.color} ${meta.bg}`}>
                    {catTests.length} {catTests.length === 1 ? 'test' : 'tests'}
                  </span>
                </div>

                {/* Tests Table */}
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs border-b border-slate-200 uppercase tracking-wider">
                      <th className="px-6 py-3 font-semibold">Test Name</th>
                      <th className="px-6 py-3 font-semibold">Type</th>
                      <th className="px-6 py-3 font-semibold">Status</th>
                      <th className="px-6 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {catTests.map(test => (
                      <tr key={test.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className={`p-1.5 rounded-lg ${meta.bg} ${meta.color}`}>{meta.icon}</span>
                            <span className="font-semibold text-slate-900">{test.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{test.type}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            test.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {test.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/superadmin/bank/${test.id}/preview`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                            >
                              <FileText size={15} />
                              Preview
                            </Link>
                            <Link
                              href={`/superadmin/bank/${test.id}/edit`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-transparent hover:border-primary-200"
                            >
                              <Settings size={15} />
                              Builder
                            </Link>
                            <DeleteTestButton testId={test.id} testName={test.name} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
