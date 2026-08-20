import Link from 'next/link';
import { db } from '@/lib/data/local/db';
import { CheckSquare, Clock, User, ChevronRight, CheckCircle2 } from 'lucide-react';

export default async function TeacherDashboardPage() {
  // Mock auth: Pick the most recently created teacher
  let teacher = null;
  try {
    teacher = db.prepare(`
      SELECT u.id, ct.center_id 
      FROM users u
      JOIN center_teachers ct ON u.id = ct.teacher_id
      WHERE u.account_type = 'center_staff'
      ORDER BY u.created_at DESC LIMIT 1
    `).get() as any;
  } catch(e) {}

  if (!teacher) {
    return (
      <div className="p-8 text-center text-slate-500">
        No teachers exist in the system yet. Please ask your center admin to add you.
      </div>
    );
  }

  const centerId = teacher.center_id;

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

      <div className="glass rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CheckSquare className="text-primary-600" size={24} />
            <h2 className="text-lg font-bold text-slate-900">Pending Evaluations</h2>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {queue.filter(q => q.status === 'submitted').length} Needs Grading
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 bg-white">
          {queue.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <CheckSquare size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-lg font-medium text-slate-900">All caught up!</p>
              <p className="mt-1">There are no pending tests to evaluate at this moment.</p>
            </div>
          ) : (
            queue.map(item => (
              <div key={item.attemptId} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold shadow-inner">
                    {item.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary-700 transition-colors">{item.studentName}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span className="flex items-center gap-1.5 font-medium text-slate-600"><Clock size={14} className="text-slate-400" /> {new Date(item.dateTaken).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><User size={14} className="text-slate-400" /> {item.testName}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  {item.status === 'graded' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 size={14} /> Graded
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock size={14} /> Pending
                    </span>
                  )}
                  <Link 
                    href={`/teacher/grading/${item.attemptId}`} 
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm ${item.status === 'graded' ? 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5'}`}
                  >
                    {item.status === 'graded' ? 'Review' : 'Evaluate'}
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
