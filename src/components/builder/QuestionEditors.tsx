'use client';

import { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

export function InstructionEditor({ block, onChange }: { block: any, onChange: (b: any) => void }) {
  return (
    <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg mb-6">
      <label className="block text-xs font-bold text-slate-700 mb-2">Block Instructions</label>
      <textarea 
        className="input-field min-h-[80px] text-sm"
        value={block.instruction || ''}
        onChange={e => onChange({ ...block, instruction: e.target.value })}
        placeholder="Enter instructions for this question block (e.g. Choose NO MORE THAN TWO WORDS)..."
      />
    </div>
  );
}

export function MultipleChoiceEditor({ block, onChange }: { block: any, onChange: (b: any) => void }) {
  const updateQuestion = (qIndex: number, field: string, value: any) => {
    const newQs = [...block.questions];
    newQs[qIndex] = { ...newQs[qIndex], [field]: value };
    onChange({ ...block, questions: newQs });
  };

  const addOption = (qIndex: number) => {
    const newQs = [...block.questions];
    newQs[qIndex].options.push(`Option ${newQs[qIndex].options.length + 1}`);
    onChange({ ...block, questions: newQs });
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQs = [...block.questions];
    newQs[qIndex].options[oIndex] = value;
    // If this was the correct answer, update that too if it matches (simplified logic)
    onChange({ ...block, questions: newQs });
  };

  const getDefaultOptions = () => {
    if (block.type === 'tfng') return ['TRUE', 'FALSE', 'NOT GIVEN'];
    if (block.type === 'ynng') return ['YES', 'NO', 'NOT GIVEN'];
    return ['A', 'B', 'C', 'D'];
  };

  const addAnotherQuestion = () => {
    const defaultOptions = getDefaultOptions();
    onChange({ 
      ...block, 
      questions: [
        ...block.questions, 
        { id: `q-${Date.now()}`, text: '', options: defaultOptions, correctAnswer: defaultOptions[0] }
      ] 
    });
  };

  return (
    <div className="space-y-6">
      <InstructionEditor block={block} onChange={onChange} />

      {block.questions.map((q: any, qIndex: number) => (
        <div key={q.id} className="p-4 border border-slate-200 rounded-lg bg-white space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Question {qIndex + 1}</label>
            <input 
              type="text" 
              className="input-field" 
              value={q.text} 
              onChange={e => updateQuestion(qIndex, 'text', e.target.value)}
              placeholder="Enter question text..."
            />
          </div>
          
          <div className="space-y-2 pl-4 border-l-2 border-slate-100">
            {q.options.map((opt: string, oIndex: number) => (
              <div key={oIndex} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuestion(qIndex, 'correctAnswer', opt)}
                  className={`shrink-0 ${q.correctAnswer === opt ? 'text-emerald-500' : 'text-slate-300 hover:text-slate-400'}`}
                  title="Mark as correct answer"
                >
                  <CheckCircle2 size={20} />
                </button>
                <input 
                  type="text" 
                  className="w-full text-sm py-1.5 px-3 border border-slate-200 rounded focus:outline-none focus:border-primary-400" 
                  value={opt} 
                  onChange={e => updateOption(qIndex, oIndex, e.target.value)}
                />
              </div>
            ))}
            <button type="button" onClick={() => addOption(qIndex)} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-2">
              <Plus size={14} /> Add Option
            </button>
          </div>
        </div>
      ))}
      <button 
        type="button" 
        onClick={addAnotherQuestion}
        className="btn-secondary text-sm flex items-center gap-2"
      >
        <Plus size={16} /> Add Another Question
      </button>
    </div>
  );
}

export function GapFillEditor({ block, onChange }: { block: any, onChange: (b: any) => void }) {
  // Simple Gap Fill Editor: Textarea with a helper to insert [blank] tokens
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...block, textWithBlanks: e.target.value });
  };

  const insertBlank = () => {
    const newId = `blank_${Object.keys(block.answers || {}).length + 1}`;
    const newText = (block.textWithBlanks || '') + ` [${newId}]`;
    const newAnswers = { ...(block.answers || {}), [newId]: [] };
    onChange({ ...block, textWithBlanks: newText, answers: newAnswers });
  };

  const updateAnswers = (blankId: string, answersStr: string) => {
    const arr = answersStr.split(',').map(s => s.trim()).filter(Boolean);
    onChange({ ...block, answers: { ...block.answers, [blankId]: arr } });
  };

  return (
    <div className="space-y-4">
      <InstructionEditor block={block} onChange={onChange} />
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-slate-500">Text with Blanks</label>
          <button type="button" onClick={insertBlank} className="text-xs font-bold text-primary-600 flex items-center gap-1">
            <Plus size={14} /> Insert Blank Token
          </button>
        </div>
        <textarea 
          className="input-field min-h-[120px] font-mono text-sm" 
          value={block.textWithBlanks} 
          onChange={handleTextChange}
          placeholder="e.g. The quick brown [blank_1] jumps over the lazy [blank_2]."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(block.answers || {}).map((blankId) => (
          <div key={blankId} className="p-3 border border-slate-200 bg-slate-50 rounded-lg">
            <label className="block text-xs font-bold text-slate-700 mb-1">{blankId} Acceptable Answers</label>
            <input 
              type="text" 
              className="input-field text-sm" 
              value={(block.answers[blankId] || []).join(', ')} 
              onChange={e => updateAnswers(blankId, e.target.value)}
              placeholder="e.g. fox, red fox (comma separated)"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MatchingEditor({ block, onChange }: { block: any, onChange: (b: any) => void }) {
  // Matching requires Premises (the questions) and Options (the pool of answers)
  const addPremise = () => onChange({ ...block, premises: [...(block.premises || []), { id: `p-${Date.now()}`, text: '', correctAnswer: '' }] });
  const addOption = () => onChange({ ...block, options: [...(block.options || []), `Option ${block.options?.length + 1 || 1}`] });

  return (
    <div className="space-y-6">
      <InstructionEditor block={block} onChange={onChange} />
      
      <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-amber-900 text-sm">Options Pool (e.g. Headings/Paragraphs)</h4>
          <button type="button" onClick={addOption} className="text-xs font-bold text-amber-700 flex items-center gap-1">
            <Plus size={14} /> Add Option
          </button>
        </div>
        <div className="space-y-2">
          {(block.options || []).map((opt: string, i: number) => (
            <input 
              key={i} 
              type="text" 
              className="input-field text-sm" 
              value={opt}
              onChange={e => {
                const newOpts = [...block.options];
                newOpts[i] = e.target.value;
                onChange({ ...block, options: newOpts });
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm">Premises (Questions)</h4>
          <button type="button" onClick={addPremise} className="text-xs font-bold text-primary-600 flex items-center gap-1">
            <Plus size={14} /> Add Premise
          </button>
        </div>
        {(block.premises || []).map((p: any, i: number) => (
          <div key={p.id} className="flex items-center gap-3">
            <span className="font-bold text-slate-400 text-sm">{i + 1}.</span>
            <input 
              type="text" 
              className="flex-1 input-field text-sm" 
              placeholder="Question text..." 
              value={p.text}
              onChange={e => {
                const newP = [...block.premises];
                newP[i].text = e.target.value;
                onChange({ ...block, premises: newP });
              }}
            />
            <select 
              className="w-48 input-field text-sm"
              value={p.correctAnswer}
              onChange={e => {
                const newP = [...block.premises];
                newP[i].correctAnswer = e.target.value;
                onChange({ ...block, premises: newP });
              }}
            >
              <option value="">-- Correct Match --</option>
              {(block.options || []).map((o: string) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShortAnswerEditor({ block, onChange }: { block: any, onChange: (b: any) => void }) {
  const addQuestion = () => onChange({ ...block, questions: [...(block.questions || []), { id: `q-${Date.now()}`, text: '', answers: [] }] });

  return (
    <div className="space-y-4">
      <InstructionEditor block={block} onChange={onChange} />
      
      {(block.questions || []).map((q: any, qIndex: number) => (
        <div key={q.id} className="p-4 border border-slate-200 rounded-lg bg-white space-y-3">
          <label className="block text-xs font-bold text-slate-500">Question {qIndex + 1}</label>
          <input 
            type="text" 
            className="input-field" 
            value={q.text} 
            onChange={e => {
              const newQs = [...block.questions];
              newQs[qIndex].text = e.target.value;
              onChange({ ...block, questions: newQs });
            }}
            placeholder="e.g. What year did the event occur?"
          />
          <label className="block text-xs font-bold text-slate-500 mt-2">Acceptable Answers (Comma separated)</label>
          <input 
            type="text" 
            className="input-field text-sm" 
            value={(q.answers || []).join(', ')} 
            onChange={e => {
              const newQs = [...block.questions];
              newQs[qIndex].answers = e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean);
              onChange({ ...block, questions: newQs });
            }}
            placeholder="e.g. 1995, nineteen ninety five"
          />
        </div>
      ))}
      <button type="button" onClick={addQuestion} className="btn-secondary text-sm flex items-center gap-2">
        <Plus size={16} /> Add Short Answer Question
      </button>
    </div>
  );
}


export function TableEditor({ block, onChange }: { block: any, onChange: (b: any) => void }) {
  const data = block.tableData || {
    cols: 2,
    rows: 2,
    headers: ['Column 1', 'Column 2'],
    cells: [['', ''], ['', '']]
  };

  const updateHeader = (colIndex: number, val: string) => {
    const newHeaders = [...data.headers];
    newHeaders[colIndex] = val;
    onChange({ ...block, tableData: { ...data, headers: newHeaders } });
  };

  const updateCell = (rowIndex: number, colIndex: number, val: string) => {
    const newCells = data.cells.map((r: any) => [...r]);
    newCells[rowIndex][colIndex] = val;
    onChange({ ...block, tableData: { ...data, cells: newCells } });
  };

  const addRow = () => {
    onChange({
      ...block,
      tableData: { ...data, rows: data.rows + 1, cells: [...data.cells, Array(data.cols).fill('')] }
    });
  };

  const addCol = () => {
    onChange({
      ...block,
      tableData: {
        ...data,
        cols: data.cols + 1,
        headers: [...data.headers, `Column ${data.cols + 1}`],
        cells: data.cells.map((r: any) => [...r, ''])
      }
    });
  };

  const removeRow = () => {
    if (data.rows <= 1) return;
    onChange({
      ...block,
      tableData: { ...data, rows: data.rows - 1, cells: data.cells.slice(0, -1) }
    });
  };

  const removeCol = () => {
    if (data.cols <= 1) return;
    onChange({
      ...block,
      tableData: {
        ...data,
        cols: data.cols - 1,
        headers: data.headers.slice(0, -1),
        cells: data.cells.map((r: any) => r.slice(0, -1))
      }
    });
  };

  const addBlankDef = () => {
    const newId = `blank_${Object.keys(block.answers || {}).length + 1}`;
    onChange({ ...block, answers: { ...(block.answers || {}), [newId]: [] } });
  };

  return (
    <div className="space-y-4">
      <InstructionEditor block={block} onChange={onChange} />
      
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={addRow} className="btn-secondary text-xs px-2 py-1">Add Row</button>
        <button type="button" onClick={addCol} className="btn-secondary text-xs px-2 py-1">Add Column</button>
        <button type="button" onClick={removeRow} className="btn-secondary text-xs px-2 py-1 text-red-600">Remove Row</button>
        <button type="button" onClick={removeCol} className="btn-secondary text-xs px-2 py-1 text-red-600">Remove Column</button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse bg-white text-sm">
          <thead>
            <tr>
              {data.headers.map((h: string, cIdx: number) => (
                <th key={cIdx} className="border-b border-r border-slate-300 p-2 bg-slate-100 last:border-r-0">
                  <input
                    type="text"
                    className="w-full bg-transparent font-bold outline-none text-slate-700 placeholder-slate-400"
                    value={h}
                    onChange={e => updateHeader(cIdx, e.target.value)}
                    placeholder="Column Title"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.cells.map((row: string[], rIdx: number) => (
              <tr key={rIdx}>
                {row.map((cell: string, cIdx: number) => (
                  <td key={cIdx} className="border-b border-r border-slate-200 p-2 last:border-r-0">
                    <textarea
                      className="w-full resize-none min-h-[60px] outline-none text-slate-600 placeholder-slate-300"
                      value={cell}
                      onChange={e => updateCell(rIdx, cIdx, e.target.value)}
                      placeholder="Type text or [blank_1]"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs text-slate-500 max-w-sm">
            To create a gap, type <strong>[blank_1]</strong>, <strong>[blank_2]</strong> in the cells above. Then add answers for them below.
          </p>
          <button type="button" onClick={addBlankDef} className="text-xs font-bold text-primary-600 flex items-center gap-1">
            <Plus size={14} /> Add Blank Definition
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(block.answers || {}).map((blankId) => (
            <div key={blankId} className="p-3 border border-slate-200 bg-slate-50 rounded-lg relative">
              <button 
                type="button" 
                onClick={() => {
                  const newAnswers = { ...block.answers };
                  delete newAnswers[blankId];
                  onChange({ ...block, answers: newAnswers });
                }} 
                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
              <label className="block text-xs font-bold text-slate-700 mb-1">{blankId} Acceptable Answers</label>
              <input 
                type="text" 
                className="input-field text-sm" 
                value={(block.answers[blankId] || []).join(', ')} 
                onChange={e => {
                  const arr = e.target.value.split(',').map((s:string) => s.trim()).filter(Boolean);
                  onChange({ ...block, answers: { ...block.answers, [blankId]: arr } });
                }}
                placeholder="e.g. fox, red fox"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
