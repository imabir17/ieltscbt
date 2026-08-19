import Link from 'next/link';
import { db } from '@/lib/data/local/db';
import { CheckSquare, Clock, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import QueueBadge from '../QueueBadge';

export default async function GradingQueuePage() {
  const centerId = 'mock-center-id';

  // Fetch attempts that are submitted or graded for students of this center
  let queue: any[] = [];
  try {
    queue = db.prepare(`
      SELECT a.id as attemptId, u.name as studentName, t.name as testName, a.submitted_at as dateTaken, a.status
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      JOIN users u ON a.student_id = u.id
      JOIN center_students cs ON u.id = cs.student_id
      WHERE cs.center_id = ? AND a.status IN ('submitted', 'graded')
      ORDER BY a.submitted_at DESC
    `).all(centerId) as any[];
  } catch(e) {}

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Evaluator Queue</h1>
        <p className="text-slate-500 mt-1">Review student submissions and provide final band scores and feedback.</p>
      </div>

      <div className="glass rounded-xl overflow-hidden border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Student</th>
              <th className="px-6 py-4 font-semibold">Test Name</th>
              <th className="px-6 py-4 font-semibold">Date Submitted</th>
              <th className="px-6 py-4 font-semibold">Modules Included</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {queue.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No submissions pending evaluation.
                </td>
              </tr>
            ) : (
              queue.map((item) => (
                <tr key={item.attemptId} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                        {item.studentName?.charAt(0) || 'S'}
                      </div>
                      <span className="font-semibold text-slate-900">{item.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {item.testName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                      <Clock size={14} />
                      {item.dateTaken ? new Date(item.dateTaken).toLocaleDateString() : 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5">
                      {['Reading', 'Listening', 'Writing'].map(mod => (
                        <span key={mod} className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'submitted' ? (
                      <Link 
                        href={`/center/grading/${item.attemptId}`} 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 font-medium text-sm rounded-lg transition-colors border border-primary-200"
                      >
                        Evaluate
                        <ChevronRight size={16} />
                      </Link>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-sm rounded border border-emerald-200">
                          <CheckCircle2 size={16} />
                          Evaluated
                        </div>
                        <Link 
                          href={`/center/grading/${item.attemptId}`} 
                          className="text-xs font-semibold text-slate-500 hover:text-primary-600 transition-colors underline underline-offset-2"
                        >
                          Reevaluate
                        </Link>
                      </div>
                    )}
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
