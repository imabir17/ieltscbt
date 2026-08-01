import { Play, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back!</h1>
        <p className="text-slate-500 mt-1">Ready for your next mock test?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 border border-slate-200">
          <div className="text-amber-500 mb-4 bg-amber-50 w-12 h-12 flex items-center justify-center rounded-xl">
            <Play size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Start a Mock Test</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">You have 3 free credits remaining.</p>
          <button className="btn-primary w-full shadow-md shadow-primary-500/20">Browse Global Bank</button>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-200">
          <div className="text-blue-500 mb-4 bg-blue-50 w-12 h-12 flex items-center justify-center rounded-xl">
            <Clock size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Pending Results</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">1 test is currently being evaluated.</p>
          <Link href="/student/results" className="btn-secondary w-full block text-center">View Status</Link>
        </div>

        <div className="glass rounded-2xl p-6 border border-slate-200 bg-gradient-to-br from-primary-50 to-white">
          <div className="text-primary-600 mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Latest Band Score</h3>
          <div className="mt-2 text-4xl font-extrabold text-primary-600">7.5</div>
          <p className="text-slate-500 text-sm mt-1 font-medium">Academic Test - Jan 15</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
        
        <div className="glass rounded-xl overflow-hidden border border-slate-200">
          <div className="divide-y divide-slate-100">
            {/* Mock Item */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">IELTS Academic Mock Test #4</h4>
                  <p className="text-sm text-slate-500">Self-serve • Taken on Oct 24, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  Evaluation in Progress
                </span>
              </div>
            </div>

            {/* Mock Item */}
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Elite Academy Final Mock</h4>
                  <p className="text-sm text-slate-500">Center: Elite English • Taken on Oct 10, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">7.0</div>
                <Link href="#" className="text-sm text-primary-600 hover:underline">View Report</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
