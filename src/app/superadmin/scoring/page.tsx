import { Search, UserCheck } from 'lucide-react';
import { repo } from '@/lib/data/local';
import Link from 'next/link';

export default async function GlobalScoringPage() {
  const submissions = await repo.getSelfServeSubmissions();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Global Scoring Queue</h2>
          <p className="text-slate-500 mt-1">Score Writing submissions from self-serve students.</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <UserCheck size={18} />
          Manage Evaluators
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button className="px-6 py-4 font-medium text-primary-600 border-b-2 border-primary-600">Queue ({submissions.length})</button>
        </div>
        
        <table className="w-full text-left border-collapse bg-white">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="px-6 py-4 font-semibold">Student ID</th>
              <th className="px-6 py-4 font-semibold">Test Name</th>
              <th className="px-6 py-4 font-semibold">Submitted</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No submissions in the queue right now.
                </td>
              </tr>
            ) : (
              submissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{sub.student_email}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{sub.test_name}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {sub.submitted_at ? new Date(sub.submitted_at).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200 capitalize">
                      {sub.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-600 font-medium hover:text-primary-700">Score</button>
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
