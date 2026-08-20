'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, MessageSquare } from 'lucide-react';
import { submitEvaluationAction } from '@/app/actions/grading';

export default function EvaluationClient({ attemptId }: { attemptId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'reading' | 'listening' | 'writing'>('reading');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock overrides for auto-marked questions
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  // Writing evaluation state
  const [writingTask1Scores, setWritingTask1Scores] = useState({ ta: 0, cc: 0, lr: 0, gra: 0 });
  const [writingTask2Scores, setWritingTask2Scores] = useState({ ta: 0, cc: 0, lr: 0, gra: 0 });
  const [writingFeedback, setWritingFeedback] = useState('');

  const toggleOverride = (qId: string, currentStatus: boolean) => {
    setOverrides(prev => ({
      ...prev,
      [qId]: prev[qId] !== undefined ? !prev[qId] : !currentStatus
    }));
  };

  const getStatus = (qId: string, originalStatus: boolean) => {
    return overrides[qId] !== undefined ? overrides[qId] : originalStatus;
  };

  // Mock data for questions
  const mockReadingListening = [
    { id: '1', question: 'What is the main purpose of the passage?', studentAnswer: 'To inform about global warming', correctAnswer: 'To discuss climate change', isCorrect: false },
    { id: '2', question: 'True or False: The sky is blue.', studentAnswer: 'TRUE', correctAnswer: 'TRUE', isCorrect: true },
    { id: '3', question: 'Match the heading to paragraph A', studentAnswer: 'vii', correctAnswer: 'vii', isCorrect: true },
    { id: '4', question: 'Fill in the blank: The quick brown ___', studentAnswer: 'foxx', correctAnswer: 'fox', isCorrect: false },
  ];

  const renderAutoMarkedList = (moduleName: string) => (
    <div className="space-y-4">
      <div className="bg-primary-50 border border-primary-200 p-4 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="font-bold text-primary-900">{moduleName} Auto-Scoring Results</h3>
          <p className="text-sm text-primary-700">The system has marked these automatically. You can override any marking below.</p>
        </div>
        <div className="text-2xl font-bold text-primary-700 bg-white px-4 py-2 rounded-lg shadow-sm">
          {mockReadingListening.filter(q => getStatus(q.id, q.isCorrect)).length} / 40
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
              <th className="p-4 font-semibold">Q#</th>
              <th className="p-4 font-semibold">Question / Prompt</th>
              <th className="p-4 font-semibold">Student Answer</th>
              <th className="p-4 font-semibold">Correct Answer</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-center">Override</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm">
            {mockReadingListening.map(q => {
              const currentStatus = getStatus(q.id, q.isCorrect);
              return (
                <tr key={q.id} className={currentStatus ? 'bg-emerald-50/30' : 'bg-red-50/30'}>
                  <td className="p-4 font-bold text-slate-700">{q.id}</td>
                  <td className="p-4 text-slate-600">{q.question}</td>
                  <td className="p-4 font-medium">{q.studentAnswer}</td>
                  <td className="p-4 text-emerald-600 font-medium">{q.correctAnswer}</td>
                  <td className="p-4 text-center">
                    {currentStatus ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                        <Check size={14} strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
                        <X size={14} strokeWidth={3} />
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleOverride(q.id, q.isCorrect)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-200 px-3 py-1 rounded bg-white transition-colors"
                    >
                      {currentStatus ? 'Mark Incorrect' : 'Mark Correct'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderWritingRubric = (title: string, isTask1: boolean, scores: any, setScores: any) => {
    const categories = [
      { id: 'ta', label: isTask1 ? 'Task Achievement' : 'Task Response' },
      { id: 'cc', label: 'Coherence and Cohesion' },
      { id: 'lr', label: 'Lexical Resource' },
      { id: 'gra', label: 'Grammatical Range and Accuracy' }
    ];

    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <h3 className="font-bold text-lg text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h3>
        
        <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap font-serif leading-relaxed">
          {/* Mock student essay */}
          "The chart illustrates the changes in global temperatures over the last decade. Overall, there is a clear upward trend. In 2010, the temperature was stable..."
        </div>

        <h4 className="font-bold text-sm text-slate-700 mb-4">Evaluation Criteria (Band 0-9)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {categories.map(cat => (
            <div key={cat.id}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-600">{cat.label}</label>
                <span className="font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded text-sm">{scores[cat.id]}</span>
              </div>
              <input 
                type="range" 
                min="0" max="9" step="0.5" 
                value={scores[cat.id]} 
                onChange={(e) => setScores({ ...scores, [cat.id]: parseFloat(e.target.value) })}
                className="w-full accent-primary-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0</span><span>9</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Calculate a mock overall average score for demonstration based on the sliders
    const t1 = (writingTask1Scores.ta + writingTask1Scores.cc + writingTask1Scores.lr + writingTask1Scores.gra) / 4;
    const t2 = (writingTask2Scores.ta + writingTask2Scores.cc + writingTask2Scores.lr + writingTask2Scores.gra) / 4;
    const avg = ((t1 + (t2 * 2)) / 3); // Task 2 is worth twice as much
    const finalScore = avg > 0 ? (Math.round(avg * 2) / 2).toFixed(1) : '7.0'; // round to nearest half band
    
    await submitEvaluationAction(attemptId, finalScore);
    
    // Simulate delay for realism
    await new Promise(r => setTimeout(r, 600));
    router.push('/teacher/dashboard');
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        {['reading', 'listening', 'writing'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-bold text-sm capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'reading' && renderAutoMarkedList('Reading')}
      {activeTab === 'listening' && renderAutoMarkedList('Listening')}
      
      {activeTab === 'writing' && (
        <div className="space-y-6">
          {renderWritingRubric('Task 1 (Academic)', true, writingTask1Scores, setWritingTask1Scores)}
          {renderWritingRubric('Task 2 (Essay)', false, writingTask2Scores, setWritingTask2Scores)}

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-slate-400" />
              Overall Feedback
            </h3>
            <textarea 
              className="input-field min-h-[150px] resize-y"
              placeholder="Write detailed feedback for the student..."
              value={writingFeedback}
              onChange={e => setWritingFeedback(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Action Bar */}
      {activeTab === 'reading' && (
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
          <button onClick={() => setActiveTab('listening')} className="btn-primary px-8 py-2">
            Next: Listening
          </button>
        </div>
      )}

      {activeTab === 'listening' && (
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
          <button onClick={() => setActiveTab('writing')} className="btn-primary px-8 py-2">
            Next: Writing
          </button>
        </div>
      )}

      {activeTab === 'writing' && (
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end gap-4">
          <button className="btn-secondary px-6 py-2">Save Draft</button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="btn-primary px-8 py-2 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Check size={18} /> {isSubmitting ? 'Submitting...' : 'Submit Final Evaluation'}
          </button>
        </div>
      )}
    </div>
  );
}
