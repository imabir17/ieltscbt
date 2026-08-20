import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EvaluationClient from './EvaluationClient';

export default async function EvaluationPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-6">
        <Link href="/teacher/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Evaluation: John Doe</h1>
        <p className="text-slate-500 mt-1">Cambridge IELTS 18 - Test 1 (Attempt ID: {resolvedParams.attemptId})</p>
      </div>

      <EvaluationClient attemptId={resolvedParams.attemptId} />
    </div>
  );
}
