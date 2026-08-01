'use client';

import { useState } from 'react';
import { Headphones, BookOpen, Edit3, Settings, Plus, Save, Trash2 } from 'lucide-react';
import AudioUploader from '@/components/builder/AudioUploader';
import RichTextEditor from '@/components/builder/RichTextEditor';
import { MultipleChoiceEditor, GapFillEditor, MatchingEditor, ShortAnswerEditor } from '@/components/builder/QuestionEditors';
import { saveTestModulesAction } from '@/app/actions/superadmin';

export default function BuilderClient({ test }: { test: any }) {
  const [activeTab, setActiveTab] = useState<'listening' | 'reading' | 'writing'>('listening');
  const [isSaving, setIsSaving] = useState(false);

  // --- Listening State ---
  const [listeningAudio, setListeningAudio] = useState('');
  const [listeningBlocks, setListeningBlocks] = useState<any[]>([]);

  // --- Reading State ---
  const [readingPassages, setReadingPassages] = useState<any[]>([]);

  // --- Writing State ---
  const [writingTask1, setWritingTask1] = useState({ type: 'Line Graph', prompt: '', imageUrl: '' });
  const [writingTask2, setWritingTask2] = useState({ prompt: '' });

  // --- Helpers ---
  const addListeningBlock = (type: string) => {
    setListeningBlocks([...listeningBlocks, { id: `block-${Date.now()}`, type, questions: [] }]);
  };

  const updateListeningBlock = (index: number, updated: any) => {
    const newB = [...listeningBlocks];
    newB[index] = updated;
    setListeningBlocks(newB);
  };

  const addReadingPassage = () => {
    setReadingPassages([...readingPassages, { id: `pass-${Date.now()}`, title: '', content: '', blocks: [] }]);
  };

  const updatePassage = (pIndex: number, field: string, val: any) => {
    const newP = [...readingPassages];
    newP[pIndex] = { ...newP[pIndex], [field]: val };
    setReadingPassages(newP);
  };

  const addReadingBlock = (pIndex: number, type: string) => {
    const newP = [...readingPassages];
    newP[pIndex].blocks.push({ id: `block-${Date.now()}`, type, questions: [] });
    setReadingPassages(newP);
  };

  const updateReadingBlock = (pIndex: number, bIndex: number, updated: any) => {
    const newP = [...readingPassages];
    newP[pIndex].blocks[bIndex] = updated;
    setReadingPassages(newP);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      listening: {
        config: { audioUrl: listeningAudio },
        questions: listeningBlocks
      },
      reading: {
        config: {},
        questions: readingPassages
      },
      writing: {
        config: { task1Type: writingTask1.type, task1Image: writingTask1.imageUrl },
        questions: { task1Prompt: writingTask1.prompt, task2Prompt: writingTask2.prompt }
      }
    };

    try {
      const formData = new FormData();
      formData.append('testId', test.id);
      formData.append('modulesData', JSON.stringify(payload));
      
      const res = await saveTestModulesAction(null, formData);
      if (res?.error) {
        alert(res.error);
      } else {
        alert('Test modules saved successfully!');
      }
    } catch (e) {
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderBlockEditor = (block: any, onChange: (b: any) => void) => {
    switch (block.type) {
      case 'multiple_choice':
      case 'tfng':
        return <MultipleChoiceEditor block={block} onChange={onChange} />;
      case 'gap_fill':
        return <GapFillEditor block={block} onChange={onChange} />;
      case 'matching':
        return <MatchingEditor block={block} onChange={onChange} />;
      case 'short_answer':
        return <ShortAnswerEditor block={block} onChange={onChange} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 shrink-0">
        <div className="flex items-center">
          <button 
            onClick={() => setActiveTab('listening')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'listening' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Headphones size={18} /> Listening Module
          </button>
          <button 
            onClick={() => setActiveTab('reading')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'reading' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <BookOpen size={18} /> Reading Module
          </button>
          <button 
            onClick={() => setActiveTab('writing')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'writing' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Edit3 size={18} /> Writing Module
          </button>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 px-6 py-2 h-10 disabled:opacity-50"
        >
          <Save size={18} /> {isSaving ? 'Saving...' : 'Save All Modules'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
        {/* LISTENING TAB */}
        {activeTab === 'listening' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <Settings size={20} className="text-slate-400" /> General Configuration
              </h3>
              <AudioUploader url={listeningAudio} onUploadSuccess={setListeningAudio} />
            </div>

            <div className="flex justify-between items-center mt-8 mb-4">
              <h3 className="font-bold text-xl text-slate-900">Listening Questions</h3>
              <div className="flex gap-2">
                <button onClick={() => addListeningBlock('multiple_choice')} className="btn-secondary text-xs px-3 py-1">Add MCQ</button>
                <button onClick={() => addListeningBlock('gap_fill')} className="btn-secondary text-xs px-3 py-1">Add Gap Fill</button>
                <button onClick={() => addListeningBlock('matching')} className="btn-secondary text-xs px-3 py-1">Add Matching</button>
              </div>
            </div>

            {listeningBlocks.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-lg">
                <p className="text-slate-500 font-medium">No question blocks created yet.</p>
              </div>
            )}

            {listeningBlocks.map((block, index) => (
              <div key={block.id} className="glass p-6 rounded-xl border border-slate-200 shadow-sm relative">
                <button onClick={() => setListeningBlocks(listeningBlocks.filter((_, i) => i !== index))} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                  <Trash2 size={18} />
                </button>
                <h4 className="font-bold text-slate-700 mb-4 uppercase text-xs tracking-wider border-b border-slate-100 pb-2">
                  Block {index + 1}: {block.type.replace('_', ' ')}
                </h4>
                {renderBlockEditor(block, (updated) => updateListeningBlock(index, updated))}
              </div>
            ))}
          </div>
        )}

        {/* READING TAB */}
        {activeTab === 'reading' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-slate-900">Reading Passages ({readingPassages.length})</h3>
              <button onClick={addReadingPassage} className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
                <Plus size={16} /> Add Passage
              </button>
            </div>

            {readingPassages.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-lg">
                <p className="text-slate-500 font-medium">No passages created yet.</p>
              </div>
            )}

            {readingPassages.map((passage, pIndex) => (
              <div key={passage.id} className="glass p-6 rounded-xl border-t-4 border-t-primary-500 border-x-slate-200 border-b-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 mr-4">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Passage {pIndex + 1} Title</label>
                    <input 
                      type="text" 
                      className="input-field text-lg font-bold" 
                      value={passage.title} 
                      onChange={e => updatePassage(pIndex, 'title', e.target.value)} 
                      placeholder="e.g. The History of the Tortoise"
                    />
                  </div>
                  <button onClick={() => setReadingPassages(readingPassages.filter((_, i) => i !== pIndex))} className="text-slate-400 hover:text-red-500 mt-6">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Passage Content</label>
                  <RichTextEditor 
                    content={passage.content} 
                    onChange={html => updatePassage(pIndex, 'content', html)} 
                  />
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-700">Questions for Passage {pIndex + 1}</h4>
                    <div className="flex gap-2">
                      <button onClick={() => addReadingBlock(pIndex, 'multiple_choice')} className="btn-secondary text-xs px-2 py-1">MCQ</button>
                      <button onClick={() => addReadingBlock(pIndex, 'tfng')} className="btn-secondary text-xs px-2 py-1">T/F/NG</button>
                      <button onClick={() => addReadingBlock(pIndex, 'gap_fill')} className="btn-secondary text-xs px-2 py-1">Gap Fill</button>
                      <button onClick={() => addReadingBlock(pIndex, 'matching')} className="btn-secondary text-xs px-2 py-1">Matching</button>
                      <button onClick={() => addReadingBlock(pIndex, 'short_answer')} className="btn-secondary text-xs px-2 py-1">Short Ans</button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {passage.blocks.map((block: any, bIndex: number) => (
                      <div key={block.id} className="p-4 border border-slate-200 bg-slate-50 rounded-lg relative">
                        <button onClick={() => {
                          const newP = [...readingPassages];
                          newP[pIndex].blocks.splice(bIndex, 1);
                          setReadingPassages(newP);
                        }} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                        <h5 className="font-bold text-slate-600 mb-3 text-xs uppercase tracking-wider">
                          {block.type.replace('_', ' ')}
                        </h5>
                        {renderBlockEditor(block, (updated) => updateReadingBlock(pIndex, bIndex, updated))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WRITING TAB */}
        {activeTab === 'writing' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="glass p-6 rounded-xl border-t-4 border-t-indigo-500 border-x-slate-200 border-b-slate-200">
              <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2 mb-4">Task 1 (Academic/General)</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Task 1 Type</label>
                  <select 
                    className="input-field max-w-xs"
                    value={writingTask1.type}
                    onChange={e => setWritingTask1({ ...writingTask1, type: e.target.value })}
                  >
                    <option>Line Graph</option>
                    <option>Bar Chart</option>
                    <option>Pie Chart</option>
                    <option>Table</option>
                    <option>Process Diagram</option>
                    <option>Map</option>
                    <option>Formal Letter (General)</option>
                    <option>Informal Letter (General)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Prompt Setup</label>
                  <RichTextEditor 
                    content={writingTask1.prompt} 
                    onChange={html => setWritingTask1({ ...writingTask1, prompt: html })} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Reference Image URL (Optional)</label>
                  <div className="flex gap-2">
                    <input 
                      type="url" 
                      placeholder="https://..." 
                      className="input-field flex-1" 
                      value={writingTask1.imageUrl}
                      onChange={e => setWritingTask1({ ...writingTask1, imageUrl: e.target.value })}
                    />
                    <div className="relative">
                       {/* Simplified Base64 image uploader for Task 1 Reference */}
                       <input 
                          type="file" 
                          accept="image/*" 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && file.size < 5 * 1024 * 1024) {
                              const reader = new FileReader();
                              reader.onload = () => setWritingTask1({ ...writingTask1, imageUrl: reader.result as string });
                              reader.readAsDataURL(file);
                            } else if (file) {
                              alert('Image must be under 5MB');
                            }
                          }}
                        />
                       <button type="button" className="btn-secondary h-full">Upload Image</button>
                    </div>
                  </div>
                  {writingTask1.imageUrl && writingTask1.imageUrl.startsWith('data:image') && (
                    <img src={writingTask1.imageUrl} alt="Reference" className="mt-4 max-h-48 border border-slate-200 rounded object-contain" />
                  )}
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl border-t-4 border-t-indigo-500 border-x-slate-200 border-b-slate-200 space-y-6">
              <h3 className="font-bold text-lg text-slate-900 border-b border-slate-100 pb-2 mb-4">Task 2 (Essay)</h3>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Essay Prompt</label>
                <RichTextEditor 
                  content={writingTask2.prompt} 
                  onChange={html => setWritingTask2({ ...writingTask2, prompt: html })} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
