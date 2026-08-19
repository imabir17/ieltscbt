import { Link as LinkIcon, Users, FileText, Activity } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/data/local/db';

export default async function CenterOverviewPage() {
  const centerRow = db.prepare('SELECT id FROM centers ORDER BY created_at DESC LIMIT 1').get() as any;
  const centerId = centerRow?.id || 'mock-center-id';

  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS center_students (
        center_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (center_id, student_id)
      )
    `);
  } catch(e) {}

  let studentCount = 0;
  let pendingGrading = 0;
  let totalAssignments = 0;
  let recentAssignments: any[] = [];

  try {
    const studentCountRow = db.prepare(`SELECT count(*) as count FROM center_students WHERE center_id = ?`).get(centerId) as any;
    studentCount = studentCountRow?.count || 0;

    const pendingGradingRow = db.prepare(`
      SELECT count(*) as count FROM attempts a
      JOIN center_students cs ON a.student_id = cs.student_id
      WHERE cs.center_id = ? AND a.status = 'submitted'
    `).get(centerId) as any;
    pendingGrading = pendingGradingRow?.count || 0;

    const assignmentsRow = db.prepare(`
      SELECT count(*) as count FROM attempts a
      JOIN center_students cs ON a.student_id = cs.student_id
      WHERE cs.center_id = ?
    `).get(centerId) as any;
    totalAssignments = assignmentsRow?.count || 0;

    recentAssignments = db.prepare(`
      SELECT a.id, t.name as test_name, u.name as student_name, a.status
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      JOIN users u ON a.student_id = u.id
      JOIN center_students cs ON u.id = cs.student_id
      WHERE cs.center_id = ?
      ORDER BY a.id DESC LIMIT 5
    `).all(centerId) as any[];
  } catch (e) {}

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Center Overview</h1>
        <p className="text-slate-500 mt-1">Manage your active exams, team, and monthly quota.</p>
      </div>

      {/* Quota Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6 border-l-4 border-l-primary-500">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Activity size={18} />
            <span className="font-medium">Exams Assigned</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalAssignments} <span className="text-xl text-slate-400 font-normal">/ 100</span></div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4">
            <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${Math.min(100, (totalAssignments/100)*100)}%` }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Resets in 12 days</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <LinkIcon size={18} />
            <span className="font-medium">Active Tests</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{recentAssignments.filter(a => a.status === 'in_progress').length}</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Users size={18} />
            <span className="font-medium">Total Students</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{studentCount}</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <FileText size={18} />
            <span className="font-medium">Pending Grading</span>
          </div>
          <div className="text-3xl font-bold text-amber-600">{pendingGrading}</div>
        </div>
      </div>

      {/* Active Exams Table */}
      <div className="glass rounded-xl border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-slate-900">Recent Assignments</h2>
          <Link href="/center/exams" className="btn-primary flex items-center gap-2">
            <LinkIcon size={16} />
            Assign New Exam
          </Link>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="px-6 py-4 font-semibold">Test Name</th>
              <th className="px-6 py-4 font-semibold">Student Name</th>
              <th className="px-6 py-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {recentAssignments.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">No recent assignments.</td></tr>
            ) : (
              recentAssignments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{a.test_name}</td>
                  <td className="px-6 py-4 text-slate-500">{a.student_name}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {a.status}
                    </span>
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
