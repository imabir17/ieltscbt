import { db } from '@/lib/data/local/db';
import { Play, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function StudentDashboardPage() {
  // Mock auth: Pick the most recently created student
  let student = null;
  try {
    student = db.prepare(`
      SELECT u.*, c.name as center_name, c.logo_url
      FROM users u
      JOIN center_students cs ON u.id = cs.student_id
      JOIN centers c ON cs.center_id = c.id
      WHERE u.account_type = 'student'
      ORDER BY u.created_at DESC LIMIT 1
    `).get() as any;
  } catch (e) {
    try {
      student = db.prepare(`
        SELECT * FROM users WHERE account_type = 'student' ORDER BY created_at DESC LIMIT 1
      `).get() as any;
    } catch (e2) {}
  }

  if (!student) {
    return (
      <div className="p-8 text-center text-slate-500">
        No students exist in the system yet. Please ask your center to add you.
      </div>
    );
  }

  // Fetch attempts for this student
  const attempts = db.prepare(`
    SELECT a.id, a.status, a.started_at, t.name as test_name, t.type as test_type
    FROM attempts a
    JOIN tests t ON a.test_id = t.id
    WHERE a.student_id = ?
    ORDER BY a.id DESC
  `).all(student.id) as any[];

  const notStarted = attempts.filter(a => a.status === 'not_started');
  const inProgress = attempts.filter(a => a.status === 'in_progress');
  const past = attempts.filter(a => ['submitted', 'grading', 'graded'].includes(a.status));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {student.name || 'Student'}!</h1>
        <p className="text-slate-500 mt-1">Ready for your next mock test?</p>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Assigned Tests</h2>
        
        {notStarted.length === 0 && inProgress.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center text-slate-500 border border-slate-200">
            No pending tests assigned to you at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...inProgress, ...notStarted].map(a => (
              <div key={a.id} className="glass rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
                <div className="flex-1">
                  <span className="inline-block px-2.5 py-1 text-xs font-bold rounded-lg mb-3 bg-blue-50 text-blue-700">
                    {a.test_type}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{a.test_name}</h3>
                  <p className="text-slate-500 text-sm mt-2">
                    {a.status === 'in_progress' ? 'You have an incomplete session.' : 'Assigned by your center.'}
                  </p>
                </div>
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <Link href={`/test/${a.id}`} className="btn-primary w-full flex justify-center items-center gap-2">
                    <Play size={16} /> {a.status === 'in_progress' ? 'Resume Test' : 'Start Test'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Past Activity</h2>
        <div className="glass rounded-xl overflow-hidden border border-slate-200">
          <div className="divide-y divide-slate-100">
            {past.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No past activity found.</div>
            ) : (
              past.map(a => (
                <div key={a.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${a.status === 'graded' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {a.status === 'graded' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{a.test_name}</h4>
                      <p className="text-sm text-slate-500">{a.status === 'graded' ? 'Evaluation Complete' : 'Evaluation in Progress'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {a.status === 'graded' ? (
                      <Link href={`/student/results/${a.id}`} className="btn-secondary text-sm py-1.5 px-4">View Report</Link>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                        Needs Grading
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
