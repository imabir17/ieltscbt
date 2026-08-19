'use client';

import { Trash2 } from 'lucide-react';
import { deleteGlobalTestAction } from '@/app/actions/superadmin';

export function DeleteTestButton({ testId, testName }: { testId: string; testName: string }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!confirm(`Delete "${testName}"? This cannot be undone.`)) {
      e.preventDefault();
    }
  };

  return (
    <form action={deleteGlobalTestAction} onSubmit={handleSubmit}>
      <input type="hidden" name="testId" value={testId} />
      <button
        type="submit"
        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
      >
        <Trash2 size={16} />
        Delete
      </button>
    </form>
  );
}
