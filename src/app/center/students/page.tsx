import { db } from '@/lib/data/local/db';
import { Users, Plus, Mail, Phone } from 'lucide-react';
import AddStudentForm from './AddStudentForm';

export default async function CenterStudentsPage() {
  const centerRow = db.prepare('SELECT id FROM centers ORDER BY created_at DESC LIMIT 1').get() as any;
  const centerId = centerRow?.id || 'mock-center-id';
  
  // Make sure table exists
  try {
    db.prepare(`
      CREATE TABLE IF NOT EXISTS center_students (
        center_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (center_id, student_id)
      )
    `).run();
  } catch(e) {}

  const students = db.prepare(`
    SELECT u.id, u.name, u.email, u.phone, cs.created_at
    FROM users u
    JOIN center_students cs ON u.id = cs.student_id
    WHERE cs.center_id = ?
    ORDER BY cs.created_at DESC
  `).all(centerId) as any[];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          <p className="text-slate-500 mt-1">Manage your enrolled students. Students cannot sign up themselves.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Phone</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No students added yet. Use the form to add your first student.
                    </td>
                  </tr>
                ) : (
                  students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                          {s.name?.charAt(0) || 'S'}
                        </div>
                        {s.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {s.email}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {s.phone ? <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {s.phone}</div> : '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="glass rounded-xl border border-slate-200 p-6 sticky top-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Plus size={20} className="text-primary-600" /> Add New Student
            </h2>
            <AddStudentForm centerId={centerId} />
          </div>
        </div>
      </div>
    </div>
  );
}
