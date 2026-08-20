import Link from 'next/link';
import { LayoutDashboard, CheckSquare, LogOut } from 'lucide-react';
import { db } from '@/lib/data/local/db';

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Mock auth: Pick the most recently created teacher
  let teacher = null;
  try {
    teacher = db.prepare(`
      SELECT u.email, u.name, c.name as center_name, c.logo_url
      FROM users u
      JOIN center_teachers ct ON u.id = ct.teacher_id
      JOIN centers c ON ct.center_id = c.id
      WHERE u.account_type = 'center_staff'
      ORDER BY u.created_at DESC LIMIT 1
    `).get() as any;
  } catch(e) {}

  const centerName = teacher?.center_name || 'MockPrep Center';
  const logoUrl = teacher?.logo_url;
  const email = teacher?.email || 'teacher@email.com';
  const name = teacher?.name || 'Evaluator';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt={centerName} className="h-8 object-contain" />
              ) : (
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {centerName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="font-bold text-xl text-slate-900 tracking-tight">{centerName}</span>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              <Link href="/teacher/dashboard" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-md flex items-center gap-2">
                <CheckSquare size={18} />
                Evaluator Queue
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              Teacher Portal
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <div className="text-sm font-medium text-slate-700 hidden sm:block">
              {name} ({email})
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
