'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Clock, User, Maximize, Minimize, Edit3, X } from 'lucide-react';

export default function PreviewViewer({ test, modules }: { test: any, modules: any[] }) {
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const activeModule = modules[activeModuleIndex];

  // Audio State
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  // UI Feature States
  const [writingText, setWritingText] = useState('');
  const [showNotepad, setShowNotepad] = useState(false);
  const [notepadText, setNotepadText] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const wordCount = writingText.trim() === '' ? 0 : writingText.trim().split(/\s+/).filter(Boolean).length;

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Auto-play audio on mount if listening test
  useEffect(() => {
    if (activeModule?.module_type === 'listening' && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.log('Audio autoplay blocked', e);
      });
    }
  }, [activeModule]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress || 0);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  let sections = [];
  try {
    sections = JSON.parse(activeModule?.questions || '[]');
  } catch (e) {}

  const activeSection = sections[activeSectionIndex];
  const groups = activeSection?.groups || [];
  const allQuestions = groups.flatMap((g: any) => g.questions || []).filter((q: any) => q.type !== 'text_block');

  // Track answered questions
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const markAnswered = (qId: number, value: string) => {
    setAnsweredQuestions(prev => {
      const next = new Set(prev);
      if (value.trim()) next.add(qId); else next.delete(qId);
      return next;
    });
  };
  const markAnsweredChecked = (qId: number, checked: boolean) => {
    setAnsweredQuestions(prev => { const next = new Set(prev); if (checked) next.add(qId); else next.delete(qId); return next; });
  };

  const scrollToQuestion = (qId: number) => {
    const el = document.getElementById(`q-${qId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Try to extract audioUrl from config
  let audioUrl = '';
  try {
    const config = JSON.parse(activeModule?.config || '{}');
    audioUrl = config.audioUrl || '';
  } catch (e) {}

  return (
    <div ref={containerRef} className="h-screen w-screen flex flex-col bg-white overflow-hidden text-[15px] font-sans antialiased fixed inset-0 z-50">
      
      {/* Hidden Audio Element */}
      {activeModule?.module_type === 'listening' && audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onTimeUpdate={handleTimeUpdate} 
        />
      )}

      {/* Top Bar - Black */}
      <header className="bg-[#111] text-white flex items-center justify-between px-4 h-12 shrink-0 relative">
        <div className="flex items-center gap-2">
          <User size={16} />
          <span className="text-[13px] font-medium tracking-wide">Preview User - ID 000000</span>
        </div>
        
        <div className="flex items-center gap-2 bg-[#333] px-3 py-1 rounded-[2px] text-[13px] font-bold">
          <Clock size={14} />
          <span>{activeModule?.module_type === 'listening' ? '29 Minutes Left' : '59 Minutes Left'}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Audio Volume Slider */}
          {activeModule?.module_type === 'listening' && (
            <div className="flex items-center gap-3 mr-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                <input 
                  type="range" 
                  min="0" max="1" step="0.05" 
                  value={volume} 
                  onChange={handleVolumeChange}
                  className="w-16 h-1 accent-white bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
          <button onClick={() => setShowHelp(true)} className="bg-white text-black px-3 py-1 text-xs font-bold rounded-[2px] flex items-center gap-1 hover:bg-gray-100">
            Help ?
          </button>
          <button onClick={toggleFullscreen} className="bg-white text-black px-3 py-1 text-xs font-bold rounded-[2px] flex items-center gap-1 hover:bg-gray-100">
            {isFullscreen ? <Minimize size={12} /> : <Maximize size={12} />}
            {isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          </button>
        </div>

        {/* Audio Progress Bar Indicator */}
        {activeModule?.module_type === 'listening' && (
          <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300" style={{ width: `${audioProgress}%` }}></div>
        )}
      </header>

      {/* Main Area - Split */}
      {activeModule ? (
        activeModule.module_type === 'writing' ? (
          <div className="flex-1 flex flex-col bg-[#f5f6f8] overflow-hidden">
            {/* Writing Task Header Banner */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 shrink-0 mx-4 mt-4 rounded-sm shadow-sm">
              <h2 className="text-[16px] font-bold text-[#111] mb-1">
                Writing {activeSection?.title}
              </h2>
              <p className="text-[13px] text-gray-500">
                You should spend about {activeSectionIndex === 0 ? '20' : '40'} minutes on this task.
              </p>
            </div>

            <main className="flex-1 flex overflow-hidden p-4 gap-4">
              {/* Left Pane - Prompt */}
              <div className="flex-1 overflow-y-auto">
                <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
                  <h3 className="text-[14px] text-gray-600 mb-4 font-medium">
                    {activeSectionIndex === 0 ? 'Task' : 'Essay Task'}
                  </h3>
                  <div className="whitespace-pre-wrap text-[14px] text-[#333] leading-relaxed">
                    {activeSection?.prompt}
                  </div>
                  {activeSection?.image && (
                    <div className="mt-8 flex flex-col items-center w-full">
                      <img src={activeSection.image} alt={activeSection.title} className="max-w-full h-auto object-contain p-2" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Pane - Textarea */}
              <div className="flex-1 flex flex-col">
                <div className="text-[13px] text-gray-600 mb-2 font-medium">
                  Word count: <span className="font-bold text-black">{wordCount}</span>
                  {wordCount > 0 && wordCount < (activeSectionIndex === 0 ? 150 : 250) && (
                    <span className="ml-2 text-amber-500 text-xs">(minimum {activeSectionIndex === 0 ? 150 : 250} words required)</span>
                  )}
                </div>
                <textarea 
                  className="flex-1 w-full border border-gray-300 rounded-sm p-5 text-[14px] outline-none focus:border-blue-500 transition-colors resize-none bg-white shadow-sm leading-relaxed"
                  placeholder={`Start writing your ${activeSection?.title} response here...`}
                  value={writingText}
                  onChange={e => setWritingText(e.target.value)}
                />
              </div>
            </main>
          </div>
        ) : activeModule.module_type === 'listening' ? (
          <main className="flex-1 overflow-y-auto bg-white p-6 flex flex-col items-center text-[#333]">
            <div className="w-full max-w-5xl">
              <div className="bg-[#f5f6f8] border border-gray-200 rounded-[2px] p-4 mb-8">
                 <h2 className="font-bold text-[15px] mb-1">{activeSection?.title || 'Part 1'}</h2>
                 <p className="text-[13px] text-gray-600">Listen and answer questions {allQuestions[0]?.id}-{allQuestions[allQuestions.length-1]?.id}</p>
              </div>
              
              <div className="space-y-12">
                {groups.map((group: any, gIdx: number) => {
                  const firstQ = group.questions[0];
                  const lastQ = group.questions[group.questions.length - 1];
                  
                  return (
                    <div key={gIdx} className="space-y-4">
                      <h3 className="text-[20px] mb-2 font-normal">Questions {firstQ?.id || 1}-{lastQ?.id || 1}</h3>
                      {group.instructions && (
                        <div className="text-[14px] leading-relaxed whitespace-pre-wrap">
                          {group.instructions}
                        </div>
                      )}
                      
                      <div className="mt-6 pl-4">
                        {group.table && (
                          <div className="overflow-x-auto mb-6">
                            <table className="w-full border-collapse text-[14px] text-left">
                              <thead>
                                <tr>
                                  {group.table.headers.map((h: string, i: number) => (
                                    <th key={i} className="pb-2 font-bold border-b border-gray-300 px-2">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {group.table.rows.map((row: string[], rIdx: number) => (
                                  <tr key={rIdx} className="border-b border-gray-100 last:border-none">
                                    {row.map((cell: string, cIdx: number) => (
                                      <td key={cIdx} className="py-3 px-2 align-top">{cell}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                        {group.questions?.map((q: any, qIdx: number) => {
                          if (q.type === 'text_block') {
                            return (
                              <div key={`text-${qIdx}`} className="my-1 whitespace-pre-wrap text-[14px] font-medium leading-relaxed">
                                {q.text}
                              </div>
                            );
                          }

                          if (q.type === 'form_completion') {
                             if (group.table) {
                               return (
                                 <div key={q.id} id={`q-${q.id}`} className="flex items-center gap-2 mb-2">
                                   <span className="font-bold text-[14px] w-8">({q.id})</span>
                                   <input type="text" onChange={e => markAnswered(q.id, e.target.value)} className="w-64 border border-gray-300 h-[36px] rounded-[2px] px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow text-[14px]" />
                                   <span className="ml-3 text-xs text-green-600 font-bold opacity-0 hover:opacity-100 transition-opacity">
                                     Answer: {q.answer}
                                   </span>
                                 </div>
                               );
                             }

                             // No table: Render the text with inline inputs
                             const parts = q.text.split(/(\[\d+\])/g);
                             return (
                               <div key={q.id} id={`q-${q.id}`} className="text-[14px] leading-[2.5] flex items-center flex-wrap gap-1 mb-2">
                                 {parts.map((part: string, pIdx: number) => {
                                   if (part.match(/\[\d+\]/)) {
                                     const num = part.replace(/[\[\]]/g, '');
                                     return (
                                       <span key={pIdx} className="inline-flex items-center mx-1 gap-1">
                                         <span className="font-bold">({num})</span>
                                         <input type="text" onChange={e => markAnswered(q.id, e.target.value)} className="w-48 border border-gray-300 h-[32px] rounded-[2px] px-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow text-[14px]" />
                                       </span>
                                     );
                                   }
                                   return <span key={pIdx}>{part}</span>;
                                 })}
                                 <span className="ml-3 text-xs text-green-600 font-bold opacity-0 hover:opacity-100 transition-opacity">
                                   Answer: {q.answer}
                                 </span>
                               </div>
                             );
                          }
                          if (q.type === 'multiple_choice') {
                            const qText = (q.text || '').replace(/^\d+[\.\s]+/, '');
                            return (
                              <div key={q.id} id={`q-${q.id}`} className="my-6">
                                <p className="text-[14px] mb-3"><span className="font-bold">{q.id}.</span> {qText}</p>
                                <div className="flex flex-col gap-2">
                                  {(q.options || []).map((opt: string) => (
                                    <label key={opt} className="flex items-center gap-3 text-[15px] cursor-pointer hover:bg-gray-50 p-1.5 -ml-1.5 border border-transparent rounded">
                                      <input type="checkbox" onChange={e => markAnsweredChecked(q.id, e.target.checked)} className="w-4 h-4 border-gray-400 rounded-sm accent-blue-600 cursor-pointer" />
                                      <span>{opt}</span>
                                    </label>
                                  ))}
                                </div>
                                <div className="mt-1 text-xs text-green-600 font-bold opacity-0 hover:opacity-100">Answer: {q.answer}</div>
                              </div>
                            );
                          } else if (q.type === 'fill_in_the_blank') {
                            const qText = (q.text || '').replace(/^\d+[\.\s]+/, '');
                            return (
                              <div key={q.id} id={`q-${q.id}`} className="my-4 flex items-center gap-4">
                                <div className="flex items-center gap-1 w-24">
                                  <span className="font-bold text-[14px]">{q.id}.</span>
                                  <span className="text-[14px]">{qText}</span>
                                </div>
                                <input type="text" onChange={e => markAnswered(q.id, e.target.value)} className="w-64 border border-gray-300 h-[36px] rounded-[2px] px-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow text-[14px]" />
                                <span className="ml-3 text-xs text-green-600 font-bold opacity-0 hover:opacity-100">Answer: {q.answer}</span>
                              </div>
                            );
                          }

                          // Other types fallback
                          const qText = (q.text || '').replace(/^\d+[\.\s]+/, '');
                          return (
                            <div key={q.id} id={`q-${q.id}`} className="my-4">
                              <p className="text-[14px] mb-2"><span className="font-bold">{q.id}.</span> {qText}</p>
                              <div className="mt-1 text-xs text-green-600 font-bold opacity-0 hover:opacity-100">Answer: {q.answer}</div>
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-1 flex overflow-hidden">
            {/* Left Pane - Passage */}
            <div className="flex-1 overflow-y-auto p-10 leading-[1.8] text-[#333] text-[15px]">
              {activeSection ? (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-xl font-bold mb-6 text-center">{activeSection.title?.toUpperCase()}</h2>
                  
                  {activeSection.image && (
                    <div className="mb-8 flex flex-col items-center">
                      <strong className="block font-bold text-center mb-4">{activeSection.image.heading}</strong>
                      <img src={activeSection.image.url} alt={activeSection.image.heading} className="max-w-full h-auto object-contain max-h-[400px]" />
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap">{activeSection.passage}</div>
                </div>
              ) : (
                <div className="text-gray-400 text-center mt-20">No reading passage available.</div>
              )}
            </div>
            
            {/* Resizer / Divider */}
            <div className="w-1.5 bg-[#e5e7eb] cursor-col-resize hover:bg-[#d1d5db] transition-colors shrink-0 flex items-center justify-center">
              <div className="w-0.5 h-8 bg-gray-400 rounded-full"></div>
            </div>

            {/* Right Pane - Questions */}
            <div className="flex-1 overflow-y-auto p-10 bg-[#f8f9fa] text-[#333]">
              {activeSection && groups.length > 0 ? (
                <div className="max-w-2xl mx-auto space-y-12">
                  
                  {groups.map((group: any, gIdx: number) => {
                    const firstQ = group.questions[0];
                    const lastQ = group.questions[group.questions.length - 1];

                    return (
                      <div key={gIdx}>
                        <h3 className="font-bold text-[16px] mb-3">
                          Questions {firstQ?.id || 1}-{lastQ?.id || 1}
                        </h3>
                        
                        {group.instructions && (
                          <div className="text-[14px] text-gray-700 leading-relaxed bg-[#f0f2f5] p-3 rounded-sm border-l-2 border-gray-400 mb-6 whitespace-pre-wrap">
                            {group.instructions}
                          </div>
                        )}

                        {/* Flow-chart passage: render prose with inline numbered inputs */}
                        {group.flow_chart_passage ? (() => {
                          const answerMap: Record<number, string> = {};
                          group.questions.forEach((q: any) => { answerMap[q.id] = q.answer; });
                          // Split the passage into lines for step-by-step layout
                          const lines = group.flow_chart_passage.split('\n');
                          return (
                            <div className="space-y-3 mb-4">
                              {lines.map((line: string, lIdx: number) => {
                                const parts = line.split(/(\[\d+\])/g);
                                const hasInputs = parts.some((p: string) => /^\[\d+\]$/.test(p));
                                return (
                                  <div key={lIdx} className="text-[14px] leading-[2.2] flex flex-wrap items-center gap-x-0.5">
                                    {parts.map((part: string, pIdx: number) => {
                                      const match = part.match(/^\[(\d+)\]$/);
                                      if (match) {
                                        const qId = parseInt(match[1]);
                                        return (
                                          <span key={pIdx} id={`q-${qId}`} className="inline-flex items-center gap-1 mx-0.5">
                                            <span className="font-bold text-black">({qId})</span>
                                            <input
                                              type="text"
                                              onChange={e => markAnswered(qId, e.target.value)}
                                              className="w-36 border-b-2 border-gray-400 bg-transparent outline-none focus:border-blue-500 text-[14px] text-center pb-0.5"
                                              placeholder="............"
                                            />
                                            <span className="text-[10px] text-green-600 font-bold opacity-0 hover:opacity-100 ml-1">{answerMap[qId]}</span>
                                          </span>
                                        );
                                      }
                                      return <span key={pIdx}>{part}</span>;
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })() : (
                        <div className="space-y-8">
                          {group.questions.map((q: any) => {
                            const qText = q.text.replace(/^\d+[\.\s]+/, ''); // Remove leading numbers
                            
                            if (q.type === 'matching_paragraphs') {
                              return (
                                <div key={q.id} id={`q-${q.id}`} className="flex justify-between items-center py-3 border-b border-gray-200">
                                  <div className="flex items-start gap-2 pr-4">
                                    <span className="text-gray-400 mt-1">•</span>
                                    <span className="text-[14px] leading-relaxed">{qText}</span>
                                  </div>
                                  <div className="flex items-center gap-0 bg-white border border-gray-300 rounded-[2px] shadow-sm shrink-0">
                                    <span className="text-[13px] text-gray-500 px-3 border-r border-gray-300 h-8 flex items-center justify-center bg-gray-50">{q.id}</span>
                                    <select onChange={e => markAnswered(q.id, e.target.value)} className="h-8 pl-2 pr-6 text-[13px] bg-transparent outline-none appearance-none cursor-pointer">
                                      <option value=""></option>
                                      {['A','B','C','D','E','F','G','H','I','J'].map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-2 text-gray-500 text-[10px]">▼</div>
                                  </div>
                                  {/* Preview Answer Hint */}
                                  <span className="ml-3 text-xs text-green-600 font-bold w-4">{q.answer}</span>
                                </div>
                              );
                            }

                            return (
                              <div key={q.id} id={`q-${q.id}`}>
                                <p className="font-bold text-[14px] mb-2">{q.id}.</p>
                                {qText.trim() && <p className="text-[14px] mb-4">{qText}</p>}
                                
                                <div className="flex flex-col gap-2 ml-1">
                                  {q.type === 'true_false_not_given' || q.type === 'yes_no_not_given' ? (
                                    (q.type === 'yes_no_not_given' ? ['YES', 'NO', 'NOT GIVEN'] : ['TRUE', 'FALSE', 'NOT GIVEN']).map(opt => (
                                      <label key={opt} className="flex items-center gap-3 text-[14px] cursor-pointer hover:bg-gray-100 p-1.5 -ml-1.5 rounded w-fit">
                                        <input type="radio" name={`q-${q.id}`} onChange={() => markAnsweredChecked(q.id, true)} className="w-4 h-4 accent-blue-600" />
                                        <span>{opt}</span>
                                      </label>
                                    ))
                                  ) : q.type === 'multiple_choice' ? (
                                    (q.options || ['A', 'B', 'C', 'D']).map((opt: string) => (
                                      <label key={opt} className="flex items-center gap-3 text-[14px] cursor-pointer hover:bg-gray-100 p-1.5 -ml-1.5 rounded w-fit">
                                        <input type="radio" name={`q-${q.id}`} onChange={() => markAnsweredChecked(q.id, true)} className="w-4 h-4 accent-blue-600" />
                                        <span>{opt}</span>
                                      </label>
                                    ))
                                  ) : (
                                    <input 
                                      type="text" 
                                      onChange={e => markAnswered(q.id, e.target.value)}
                                      className="border border-gray-300 rounded-[2px] px-3 py-1.5 text-[14px] w-full max-w-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow" 
                                      placeholder="Type your answer..." 
                                    />
                                  )}
                                </div>
                                {/* Preview Answer Hint */}
                                <div className="mt-3 text-xs text-green-600">Answer: <span className="font-bold">{q.answer}</span></div>
                              </div>
                            );
                          })}
                        </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              ) : (
                <div className="text-gray-400 text-center mt-20">No questions available.</div>
              )}
            </div>
          </main>
        )
      ) : (
        <main className="flex-1 flex items-center justify-center text-gray-500">
          No modules available.
        </main>
      )}

      {/* Bottom Bar - Navigation */}
      {activeModule?.module_type === 'listening' ? (
        <footer className="h-14 border-t border-gray-200 bg-white flex items-center justify-between px-4 shrink-0 text-[#333]">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-[13px] font-medium cursor-pointer">
              <input type="checkbox" className="w-4 h-4" />
              Flag
            </label>
            <div className="font-bold text-[14px] mx-2">Listening</div>
            <div className="flex items-center gap-1">
              {sections.map((sec, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveSectionIndex(idx)}
                  className={`px-3 py-1 text-[13px] rounded-sm ${idx === activeSectionIndex ? 'bg-[#3b82f6] text-white font-bold' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  Part {idx + 1}
                </button>
              ))}
            </div>
          </div>
          
          {/* Center section: Question numbers */}
          <div className="flex items-center gap-1 overflow-x-auto mx-4 flex-1">
            {allQuestions.map((q: any) => (
              <button 
                key={q.id}
                onClick={() => scrollToQuestion(q.id)}
                className={`w-7 h-7 shrink-0 flex items-center justify-center text-[12px] rounded-sm border font-medium transition-colors ${
                  answeredQuestions.has(q.id)
                    ? 'bg-green-500 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {q.id}
              </button>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4 shrink-0">
            <button onClick={() => setShowNotepad(true)} className="flex items-center gap-1 border border-gray-300 rounded-[2px] px-3 py-1.5 text-[13px] font-medium hover:bg-gray-50">
              <Edit3 size={15} />
              Notepad
            </button>
            <Link href="/superadmin/bank" className="bg-[#00c853] text-white px-6 py-1.5 text-[14px] font-bold rounded-[2px] hover:bg-[#00a844] transition-colors">
              Submit Test
            </Link>
          </div>
        </footer>
      ) : activeModule?.module_type === 'writing' ? (
        <footer className="h-14 border-t border-gray-200 bg-white flex items-center px-4 shrink-0 gap-2">
          <div className="flex flex-1 items-center gap-2 h-full py-2">
            {sections.map((sec, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveSectionIndex(idx)}
                className={`flex-1 h-full text-[13px] font-bold rounded-[2px] border ${idx === activeSectionIndex ? 'bg-[#111c2d] text-white border-[#111c2d]' : 'bg-white text-[#333] border-gray-300 hover:bg-gray-50'}`}
              >
                Task {idx + 1}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 py-2 h-full shrink-0">
            <div className="flex flex-col gap-1 items-center justify-center opacity-0 pointer-events-none">
              <div className="flex gap-1">
                <div className="w-4 h-1.5 bg-gray-300 rounded-sm"></div>
                <div className="w-4 h-1.5 bg-black rounded-sm"></div>
                <div className="w-4 h-1.5 bg-gray-300 rounded-sm"></div>
              </div>
            </div>
            <Link href="/superadmin/bank" className="bg-[#d32f2f] text-white px-6 py-2 text-[13px] font-bold rounded-[2px] hover:bg-red-700 transition-colors h-full flex items-center justify-center">
              Submit Test
            </Link>
          </div>
        </footer>
      ) : (
        <footer className="bg-white border-t border-gray-300 flex items-center justify-between px-4 h-14 shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-10">
          <div className="flex items-center h-full">
            <button className="px-5 h-full text-[13px] font-semibold text-gray-600 hover:bg-gray-50 border-r border-gray-200">
              Review
            </button>
            <div className="px-5 h-full flex items-center text-[13px] font-semibold text-gray-800 border-r border-gray-200 bg-gray-50">
              Reading
            </div>
            {sections.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveSectionIndex(idx)}
                className={`px-5 h-full text-[13px] font-semibold border-r border-gray-200 transition-colors ${
                  idx === activeSectionIndex 
                    ? 'bg-[#0070c0] text-white hover:bg-[#0060a0]' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Part {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex-1 flex items-center justify-center px-4 overflow-hidden">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
              {allQuestions.map((q: any) => (
                <button 
                  key={q.id}
                  onClick={() => scrollToQuestion(q.id)}
                  className={`w-[30px] h-[30px] shrink-0 flex items-center justify-center border text-[13px] font-medium rounded-[2px] transition-colors ${
                    answeredQuestions.has(q.id)
                      ? 'bg-green-500 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  {q.id}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center h-full">
            <button onClick={() => setShowNotepad(true)} className="px-5 h-full flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 border-l border-gray-200">
              <Edit3 size={16} />
              Notepad
            </button>
            <Link href="/superadmin/bank" className="bg-[#0070c0] text-white px-8 h-full flex items-center justify-center text-[13px] font-bold hover:bg-[#0060a0] transition-colors">
              Submit
            </Link>
          </div>
        </footer>
      )}

      {/* Notepad Modal */}
      {showNotepad && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-[540px] flex flex-col" style={{maxHeight: '70vh'}}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2 font-bold text-[15px]">
                <Edit3 size={16} />
                Notepad
              </div>
              <button onClick={() => setShowNotepad(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
              Your notes are private and will not be submitted.
            </div>
            <textarea
              className="flex-1 p-4 text-[14px] outline-none resize-none leading-relaxed min-h-[300px]"
              placeholder="Type your notes here..."
              value={notepadText}
              onChange={e => setNotepadText(e.target.value)}
              autoFocus
            />
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
              <span className="text-xs text-gray-400">{notepadText.length} characters</span>
              <button onClick={() => setNotepadText('')} className="text-xs text-red-500 hover:text-red-700">Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl w-[500px]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h2 className="font-bold text-[16px]">Help & Keyboard Shortcuts</h2>
              <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-5 py-4 text-[14px] text-gray-700 space-y-4">
              <div>
                <h3 className="font-bold mb-2 text-[15px]">General</h3>
                <ul className="space-y-1.5 text-gray-600">
                  <li className="flex justify-between"><span>Toggle Fullscreen</span><kbd className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-xs font-mono">F11</kbd></li>
                  <li className="flex justify-between"><span>Open Notepad</span><kbd className="bg-gray-100 border border-gray-300 rounded px-2 py-0.5 text-xs font-mono">Ctrl + N</kbd></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-[15px]">Writing Task</h3>
                <ul className="space-y-1.5 text-gray-600">
                  <li>• Task 1 requires a minimum of <strong>150 words</strong>.</li>
                  <li>• Task 2 requires a minimum of <strong>250 words</strong>.</li>
                  <li>• The word counter updates in real time as you type.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-[15px]">Listening Task</h3>
                <ul className="space-y-1.5 text-gray-600">
                  <li>• Audio plays automatically when the test begins.</li>
                  <li>• Use the volume slider in the top bar to adjust audio.</li>
                  <li>• Audio will only play once and cannot be paused.</li>
                </ul>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-right rounded-b-lg">
              <button onClick={() => setShowHelp(false)} className="bg-[#111] text-white px-5 py-1.5 text-sm font-bold rounded hover:bg-black transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
