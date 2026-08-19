const { PDFParse } = require('pdf-parse');
const fs = require('fs');

const buf = fs.readFileSync('tests/reading/reading3/practicepteonline.com-IELTS Reading Test   IELTS MASTER-fpscreenshot.pdf');
const parser = new PDFParse();
parser.parse(buf).then(data => {
  const text = data.text || data.pages?.map(p => p.text).join('\n') || JSON.stringify(data).slice(0, 2000);
  fs.writeFileSync('reading3_raw.txt', text);
  console.log('Done. Chars:', text.length);
  console.log('First 500:', text.slice(0, 500));
}).catch(e => {
  console.error('Error:', e.message);
  console.log('data keys available (trying sync approach)');
});
