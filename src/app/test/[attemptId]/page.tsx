'use client';

import { useTestStore } from '@/lib/store/testStore';
import { PlayCircle } from 'lucide-react';

export default function TestPage() {
  const { currentSection } = useTestStore();

  return (
    <div className="h-full flex">
      {/* Left Pane (Stimulus/Passage) */}
      <div className="w-1/2 h-full overflow-y-auto p-8 border-r border-slate-200 relative bg-slate-50">
        {currentSection === 'listening' ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-6">
              <PlayCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Listening Test</h2>
            <p className="text-center max-w-sm">
              The audio will play automatically. You will hear the recording only once.
            </p>
            
            {/* Mock Audio Player */}
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-4 mt-8 shadow-sm">
              <div className="flex items-center gap-4">
                <button className="text-primary-600">
                  <PlayCircle size={32} />
                </button>
                <div className="flex-1">
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary-500 h-full w-1/3"></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>10:24</span>
                    <span>30:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Reading Passage 1</h2>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <h3 className="text-lg font-bold text-slate-900 mt-6 mb-2">The Impact of Climate Change</h3>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Pane (Questions) */}
      <div className="w-1/2 h-full overflow-y-auto p-8 bg-white">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Questions 1-5</h3>
        <p className="text-slate-600 mb-8 italic">Choose the correct letter, A, B, C or D.</p>
        
        <div className="space-y-8">
          {/* Question 1 */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <p className="font-medium text-slate-900 mb-4"><span className="font-bold mr-2">1</span>What is the main topic of the passage?</p>
            <div className="space-y-3">
              {['The history of writing', 'The impact of climate change', 'A new scientific discovery', 'Economic trends in the 21st century'].map((option, i) => (
                <label key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors">
                  <input type="radio" name="q1" className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                  <span className="text-slate-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Question 2 */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <p className="font-medium text-slate-900 mb-4"><span className="font-bold mr-2">2</span>Complete the sentence below.</p>
            <p className="text-slate-600 mb-2 italic text-sm">Write NO MORE THAN TWO WORDS.</p>
            <div className="flex items-center gap-3 mt-4 text-slate-800">
              The researchers found that the <input type="text" className="border-b-2 border-slate-400 bg-transparent px-2 py-1 w-48 focus:outline-none focus:border-primary-600 font-medium" /> was responsible.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
