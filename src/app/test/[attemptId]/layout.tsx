'use client';

import { useTestStore } from '@/lib/store/testStore';
import { Clock, Flag, LayoutGrid, ChevronRight, ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TestLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ attemptId: string }>;
}) {
  const { timeLeft, setTimeLeft, currentSection } = useTestStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Simple timer interval
    const timer = setInterval(() => {
      setTimeLeft(useTestStore.getState().timeLeft - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [setTimeLeft]);

  // Format time
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isClient) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Header (CBT style) */}
      <header className="bg-slate-900 text-white h-14 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg">IELTS MockPrep</div>
          <div className="h-6 w-px bg-slate-700"></div>
          <div className="text-slate-300 font-medium capitalize">{currentSection} Module</div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg bg-slate-800 px-4 py-1 rounded-md border border-slate-700">
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
          <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
            <LayoutGrid size={20} />
            <span className="text-sm font-medium">Review</span>
          </button>
        </div>
      </header>

      {/* Main split view */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left/Content area */}
        <div className="flex-1 bg-white border-r border-slate-300 flex flex-col relative overflow-hidden">
           {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <footer className="bg-slate-200 border-t border-slate-300 h-16 flex items-center justify-between px-6 shrink-0">
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-300 rounded-lg transition-colors font-medium">
          <ChevronLeft size={20} />
          Previous
        </button>
        
        <div className="flex items-center gap-2">
          {/* Mock question navigator */}
          {[1, 2, 3, 4, 5].map(q => (
            <button key={q} className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold border transition-colors ${q === 1 ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'}`}>
              {q}
            </button>
          ))}
          <span className="text-slate-400 px-2">...</span>
          <button className="w-8 h-8 rounded bg-white text-slate-600 border border-slate-300 flex items-center justify-center font-bold hover:bg-slate-100">
            40
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-300 rounded-lg transition-colors font-medium">
            <Flag size={18} />
            Flag for Review
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-bold shadow-sm">
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
}
