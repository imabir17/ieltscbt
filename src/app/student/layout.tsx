import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { logout } from '@/app/actions/auth';
import { LayoutDashboard, FileClock, Award, LogOut } from 'lucide-react';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const email = session?.email || 'Student';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/student/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
                  M
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">MockPrep</span>
              </Link>
              
              <nav className="hidden md:flex space-x-1">
                <Link href="/student/dashboard" className="px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-md">
                  Dashboard
                </Link>
                <Link href="/student/mocks" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-md">
                  My Mock Tests
                </Link>
                <Link href="/student/results" className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-md">
                  Results
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 shadow-sm">
                <Award size={16} className="text-amber-600" />
                3 Credits Left
              </div>
              
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              
              <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-slate-700 hidden sm:block">{email}</div>
                <form action={logout}>
                  <button type="submit" className="text-slate-400 hover:text-slate-700 transition-colors" title="Log out">
                    <LogOut size={20} />
                  </button>
                </form>
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
