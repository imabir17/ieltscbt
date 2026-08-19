import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'tests/reading/reading3/practicepteonline.com-IELTS Reading Test 3.pdf');

const data = new Uint8Array(fs.readFileSync(filePath));
const loadingTask = pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true });

const pdfDoc = await loadingTask.promise;
let fullText = '';

for (let i = 1; i <= pdfDoc.numPages; i++) {
  const page = await pdfDoc.getPage(i);
  const content = await page.getTextContent();
  const pageText = content.items.map(item => item.str).join(' ');
  fullText += `\n\n=== PAGE ${i} ===\n\n` + pageText;
}

fs.writeFileSync('reading3_raw.txt', fullText);
console.log('Done. Pages:', pdfDoc.numPages, 'Chars:', fullText.length);
console.log('\nFirst 2000:\n', fullText.slice(0, 2000));
