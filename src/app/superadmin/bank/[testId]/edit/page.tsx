import { repo } from '@/lib/data/local';
import { notFound } from 'next/navigation';
import BuilderClient from './BuilderClient';

export default async function TestBuilderPage({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = await params;
  const test = await repo.getTestById(resolvedParams.testId);

  if (!test) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">{test.name}</h2>
        <p className="text-slate-500 mt-1 capitalize">{test.type} Test Builder</p>
      </div>
      
      <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
        <BuilderClient test={test} />
      </div>
    </div>
  );
}
