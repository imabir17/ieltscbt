import { Link as LinkIcon, Users, FileText, Activity } from 'lucide-react';
import Link from 'next/link';

export default function CenterOverviewPage() {
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
            <span className="font-medium">Quota Usage</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">42 <span className="text-xl text-slate-400 font-normal">/ 100</span></div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4">
            <div className="bg-primary-500 h-2 rounded-full" style={{ width: '42%' }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">Resets in 12 days</p>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <LinkIcon size={18} />
            <span className="font-medium">Active Exams</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">3</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Users size={18} />
            <span className="font-medium">Total Students</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">128</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <FileText size={18} />
            <span className="font-medium">Pending Grading</span>
          </div>
          <div className="text-3xl font-bold text-amber-600">14</div>
        </div>
      </div>

      {/* Active Exams Table */}
      <div className="glass rounded-xl border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
          <h2 className="text-lg font-bold text-slate-900">Currently Hosting</h2>
          <Link href="/center/exams" className="btn-primary flex items-center gap-2">
            <LinkIcon size={16} />
            Host New Exam
          </Link>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
              <th className="px-6 py-4 font-semibold">Exam Name</th>
              <th className="px-6 py-4 font-semibold">Test Used</th>
              <th className="px-6 py-4 font-semibold">Link Code</th>
              <th className="px-6 py-4 font-semibold">Enrolled</th>
              <th className="px-6 py-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">Weekend Batch Mock</td>
              <td className="px-6 py-4 text-slate-500">IELTS Academic v3</td>
              <td className="px-6 py-4">
                <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono text-sm border border-slate-200">WKN-839</code>
              </td>
              <td className="px-6 py-4 text-slate-900 font-medium">45</td>
              <td className="px-6 py-4 text-right">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Open
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
