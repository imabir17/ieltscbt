import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('local.db');

const testId = randomUUID();
const writingTest = {
  id: testId,
  name: 'IELTS Writing Test 1',
  type: 'Academic',
  owner_center_id: null,
};

const stmt = db.prepare(`
  INSERT INTO tests (id, name, type, owner_center_id)
  VALUES (?, ?, ?, ?)
`);
stmt.run(writingTest.id, writingTest.name, writingTest.type, writingTest.owner_center_id);

const moduleId = randomUUID();
const moduleData = {
  id: moduleId,
  test_id: testId,
  module_type: 'writing',
  config: JSON.stringify({ duration_minutes: 60 }),
  questions: JSON.stringify([
    {
      id: 1,
      title: 'Task 1',
      prompt: 'The two maps below show road access to a city hospital in 2007 and 2010. Summarize the information by selecting and reporting the main features and make comparisons wherever relevant.\n\nWrite at least 150 words.',
      image: '/tests/writing/writing1/IELTS Writing Test 1.pdf'
    },
    {
      id: 2,
      title: 'Task 2',
      prompt: 'Living in a country where you have to speak a foreign language can cause serious social problems, as well as practical problems.\n\nTo what extent do you agree or disagree with this statement?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.'
    }
  ])
};

const modStmt = db.prepare(`
  INSERT INTO test_modules (id, test_id, module_type, config, questions)
  VALUES (?, ?, ?, ?, ?)
`);
modStmt.run(moduleData.id, moduleData.test_id, moduleData.module_type, moduleData.config, moduleData.questions);

console.log('Successfully added IELTS Writing Test 1 to the database!');
