import { db } from '@/lib/data/local/db';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Award, Clock } from 'lucide-react';

export default async function StudentResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const resolvedParams = await params;

  // Ensure table safety
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS center_students (
        center_id TEXT NOT NULL,
        student_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (center_id, student_id)
      )
    `);
  } catch(e) {}

  let attempt = null;
  try {
    attempt = db.prepare(`
      SELECT a.id, a.status, a.submitted_at, a.overall_score, t.name as test_name, t.type as test_type
      FROM attempts a
      JOIN tests t ON a.test_id = t.id
      WHERE a.id = ?
    `).get(resolvedParams.attemptId) as any;
  } catch(e) {}

  if (!attempt) {
    return (
      <div className="p-8 text-center text-slate-500">
        Attempt not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="glass rounded-2xl p-8 border border-slate-200 text-center mb-8 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-5 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
          <Award size={32} />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">{attempt.test_name}</h1>
        <p className="text-slate-500">{attempt.test_type} Module</p>
        
        <div className="mt-8 py-8 border-t border-b border-slate-100">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Band Score</div>
          <div className="text-7xl font-extrabold text-primary-600 tracking-tight">
            {attempt.overall_score || 'N/A'}
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            Evaluation Complete
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            Submitted on {attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleDateString() : 'Unknown'}
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-6">Detailed Feedback</h3>
        <p className="text-slate-600 leading-relaxed">
          Your center has evaluated your Writing and Speaking tasks based on the official IELTS rubrics (Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy). 
          <br /><br />
          If you have specific questions about your score breakdown, please contact your Center Administrator directly!
        </p>
      </div>
    </div>
  );
}
