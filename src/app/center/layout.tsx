import Link from 'next/link';
import { LayoutDashboard, Users, FileEdit, Link as LinkIcon, CheckSquare, Building } from 'lucide-react';
import QueueBadge from './QueueBadge';

export default async function CenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = 'coaching@email.com';

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
          <Link href="/center" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <LayoutDashboard size={20} />
            Overview
          </Link>
          <Link href="/center/students" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Users size={20} />
            Students
          </Link>
          <Link href="/center/exams" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <LinkIcon size={20} />
            Host Exams
          </Link>
          <Link href="/center/teachers" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Users size={20} />
            Teachers
          </Link>
          <Link href="/center/grading" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <CheckSquare size={20} />
            Evaluator Queue
            <QueueBadge />
          </Link>
        </nav>
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
