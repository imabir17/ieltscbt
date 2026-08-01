import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { logout } from '@/app/actions/auth';
import { LayoutDashboard, Users, FileEdit, Link as LinkIcon, CheckSquare, LogOut, Building } from 'lucide-react';

export default async function CenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const email = session?.email || 'Staff';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center">
            <Building size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-tight">Elite English</h2>
            <p className="text-xs text-slate-500 mt-0.5">Center Admin</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <Link href="/center" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary-700 bg-primary-50 font-medium">
            <LayoutDashboard size={20} />
            Overview
          </Link>
          <Link href="/center/team" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Users size={20} />
            Team Setup
          </Link>
          <Link href="/center/tests" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <FileEdit size={20} />
            Test Creator
          </Link>
          <Link href="/center/exams" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <LinkIcon size={20} />
            Host Exams
          </Link>
          <Link href="/center/grading" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <CheckSquare size={20} />
            Evaluator Queue
            <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">4</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <form action={logout}>
            <button type="submit" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors font-medium">
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-slate-700">{email}</div>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-medium text-primary-700">
              {email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
