import Link from 'next/link';
import { Building2, CreditCard, Library, PenTool, Settings } from 'lucide-react';

export default async function SuperadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = 'admin@platform.com';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white tracking-tight">IELTS Admin</h2>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Superuser</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <Link href="/superadmin" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors">
            <Building2 size={20} />
            Centers
          </Link>
          <Link href="/superadmin/plans" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <CreditCard size={20} />
            Plans & Billing
          </Link>
          <Link href="/superadmin/bank" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <Library size={20} />
            Global Bank
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
              {email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{email}</p>
            </div>
          </div>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-slate-800">Dashboard</h1>
          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-slate-800 transition-colors"><Settings size={20} /></button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
