import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('local.db');

const row = db.prepare('SELECT questions FROM test_modules WHERE module_type = ?').get('listening');
if (!row) {
  console.log("Listening module not found");
  process.exit(1);
}

const sections = JSON.parse(row.questions);

// Patch Part 3 (sections[2])
// Group 0: Q21-23
const p3g0 = sections[2].groups[0].questions;
const newP3G0 = [];
for (const q of p3g0) {
  newP3G0.push(q);
  if (q.id === 22) {
    newP3G0.push({ type: 'text_block', text: 'Computer modeling' });
    newP3G0.push({ type: 'text_block', text: 'Weaknesses: lack of background information' });
  }
}
sections[2].groups[0].questions = newP3G0;

// Patch Part 4 (sections[3])
// Group 1: Q33-40
const p4g1 = sections[3].groups[1].questions;
const newP4G1 = [];

newP4G1.push({ type: 'text_block', text: 'Design\n• Built in the earth, with two floors' });

for (const q of p4g1) {
  newP4G1.push(q);
  if (q.id === 33) {
    newP4G1.push({ type: 'text_block', text: '• Photovoltaic tiles were attached' });
  }
  if (q.id === 34) {
    newP4G1.push({ type: 'text_block', text: 'Special features' });
  }
  if (q.id === 38) {
    newP4G1.push({ type: 'text_block', text: 'Environmental issues' });
  }
}
sections[3].groups[1].questions = newP4G1;

// Update DB
const updateStmt = db.prepare('UPDATE test_modules SET questions = ? WHERE module_type = ?');
updateStmt.run(JSON.stringify(sections), 'listening');
console.log("Text blocks patched successfully.");
