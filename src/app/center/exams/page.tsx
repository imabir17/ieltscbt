import { db } from '@/lib/data/local/db';
import { Link as LinkIcon, Users, FileEdit } from 'lucide-react';
import AssignExamForm from './AssignExamForm';

export default async function HostExamsPage() {
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

  // 1. Fetch available tests from global bank
  const testsRows = db.prepare(`
    SELECT id, name, type 
    FROM tests 
    WHERE owner_center_id IS NULL OR owner_center_id = ?
    ORDER BY created_at DESC
  `).all(centerId) as any[];
  const tests = testsRows.map(t => ({ ...t }));

  // 2. Fetch center students
  let students: any[] = [];
  try {
    const studentRows = db.prepare(`
      SELECT u.id, u.name, u.email 
      FROM users u
      JOIN center_students cs ON u.id = cs.student_id
      WHERE cs.center_id = ?
    `).all(centerId) as any[];
    students = studentRows.map(s => ({ ...s }));
  } catch(e) {}

  // 3. Fetch current assignments (attempts)
  let assignments: any[] = [];
  try {
    assignments = db.prepare(`
      SELECT a.id, a.status, a.started_at, t.name as test_name, u.name as student_name
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      JOIN users u ON a.student_id = u.id
      JOIN center_students cs ON u.id = cs.student_id
      WHERE cs.center_id = ?
      ORDER BY a.started_at DESC, a.id DESC
    `).all(centerId) as any[];
  } catch(e) {}

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Host Exams</h1>
        <p className="text-slate-500 mt-1">Assign mock tests from the global bank to your students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="glass rounded-xl border border-slate-200 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <FileEdit size={20} className="text-primary-600" /> Assign New Exam
            </h2>
            <AssignExamForm tests={tests} students={students} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
              Active & Past Assignments
            </div>
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                  <th className="px-6 py-4 font-semibold">Test</th>
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                      No exams assigned yet.
                    </td>
                  </tr>
                ) : (
                  assignments.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">{a.test_name}</td>
                      <td className="px-6 py-4 text-slate-600">{a.student_name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-lg ${
                          a.status === 'not_started' ? 'bg-slate-100 text-slate-600' :
                          a.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                          a.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                          a.status === 'graded' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {a.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
