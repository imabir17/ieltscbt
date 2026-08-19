import Link from 'next/link';
import { LayoutDashboard, FileClock, Award } from 'lucide-react';
import { db } from '@/lib/data/local/db';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure table exists to prevent crash on fresh installs
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS center_students (
        center_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (center_id, student_id)
      )
    `);
  } catch (e) {}

  // Mock auth: Pick the most recently created student
  let student = null;
  try {
    student = db.prepare(`
      SELECT u.email, u.name, c.name as center_name, c.logo_url
      FROM users u
      JOIN center_students cs ON u.id = cs.student_id
      JOIN centers c ON cs.center_id = c.id
      WHERE u.account_type = 'student'
      ORDER BY u.created_at DESC LIMIT 1
    `).get() as any;
  } catch (e) {}

  const centerName = student?.center_name || 'MockPrep Center';
  const logoUrl = student?.logo_url;
  const email = student?.email || 'student@email.com';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/student/dashboard" className="flex items-center gap-2">
                {logoUrl ? (
                  <img src={logoUrl} alt={centerName} className="h-8 object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {centerName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-bold text-xl text-slate-900 tracking-tight">{centerName}</span>
              </Link>
              
              <nav className="hidden md:flex space-x-1">
                <Link href="/student/dashboard" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-md">
                  Dashboard
                </Link>
                <Link href="/student/dashboard" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-md">
                  My Mock Tests
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-sm">
                <Award size={16} className="text-amber-600" />
                Student Portal
              </div>
              
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-slate-700 hidden sm:block">{email}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
