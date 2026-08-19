import fs from 'fs';
import path from 'path';

const examPage = path.join(process.cwd(), 'src/app/exam/[code]/page.tsx');
let content = fs.readFileSync(examPage, 'utf8');

content = content.replace(
  /const session = await getSession\(\);/,
  `const session = { email: 'student@email.com', role: 'student', userId: 'student-id' };`
);

fs.writeFileSync(examPage, content, 'utf8');
console.log('Patched exam page');
