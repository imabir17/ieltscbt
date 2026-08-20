import { db } from '@/lib/data/local/db';
import { GraduationCap, Mail } from 'lucide-react';
import AddTeacherForm from './AddTeacherForm';

export default async function CenterTeachersPage() {
  const centerRow = db.prepare('SELECT id FROM centers ORDER BY created_at DESC LIMIT 1').get() as any;
  const centerId = centerRow?.id || 'mock-center-id';
  
  // Make sure table exists
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS center_teachers (
        center_id TEXT NOT NULL,
        teacher_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (center_id, teacher_id)
      )
    `);
  } catch(e) {}

  let teachers: any[] = [];
  try {
    teachers = db.prepare(`
      SELECT u.id, u.name, u.email, u.created_at
      FROM users u
      JOIN center_teachers ct ON u.id = ct.teacher_id
      WHERE ct.center_id = ?
      ORDER BY u.created_at DESC
    `).all(centerId) as any[];
  } catch(e) {}

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage Teachers</h1>
        <p className="text-slate-500 mt-1">Add evaluators to grade your students' mock tests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <AddTeacherForm centerId={centerId} />
        </div>
        
        <div className="lg:col-span-2">
          <div className="glass rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap size={20} className="text-slate-400" />
                Teacher Roster
              </h2>
              <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {teachers.length} Teachers
              </div>
            </div>
            
            <div className="divide-y divide-slate-100 bg-white">
              {teachers.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No teachers added yet.
                </div>
              ) : (
                teachers.map(t => (
                  <div key={t.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{t.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <Mail size={14} />
                          {t.email}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
