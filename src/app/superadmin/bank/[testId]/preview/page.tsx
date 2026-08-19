import { repo } from '@/lib/data/local';
import PreviewViewer from './PreviewViewer';

export default async function TestPreviewPage({ params }: { params: Promise<{ testId: string }> }) {
  const resolvedParams = await params;
  const testId = resolvedParams.testId;
  const test = await repo.getTestById(testId);
  const modules = await repo.getTestModulesByTestId(testId);

  if (!test) {
    return <div className="p-8 text-center text-slate-500">Test not found</div>;
  }

  return <PreviewViewer test={{ ...test }} modules={modules.map(m => ({ ...m }))} />;
}
