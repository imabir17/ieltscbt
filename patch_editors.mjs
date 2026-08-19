import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src/components/builder/QuestionEditors.tsx');
let content = fs.readFileSync(file, 'utf8');

const tableEditorCode = `
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
        headers: [...data.headers, \`Column \${data.cols + 1}\`],
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
    const newId = \`blank_\${Object.keys(block.answers || {}).length + 1}\`;
    onChange({ ...block, answers: { ...(block.answers || {}), [newId]: [] } });
  };

  return (
    <div className="space-y-4">
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
`;

content += '\n' + tableEditorCode;
fs.writeFileSync(file, content, 'utf8');
console.log('Appended TableEditor');
