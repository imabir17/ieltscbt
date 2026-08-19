import { DatabaseSync } from 'node:sqlite';
import { randomUUID } from 'crypto';

const database = new DatabaseSync('./local.db');

const testId = randomUUID();
const moduleId = randomUUID();

const test = {
  id: testId,
  owner_center_id: null, // global question bank
  name: 'IELTS Reading Test 1',
  type: 'Academic',
  status: 'published'
};

database.prepare(`
  INSERT INTO tests (id, owner_center_id, name, type, status)
  VALUES (?, ?, ?, ?, ?)
`).run(test.id, test.owner_center_id, test.name, test.type, test.status);

const config = JSON.stringify({
  timeLimit: 60,
  instructions: 'Read the passages and answer the questions.'
});

const questions = JSON.stringify([
  {
    title: 'Attitudes to Language',
    passage: `It is not easy to be systematic and objective about language study...`,
    questions: [
      { id: 1, type: 'yes_no_not_given', text: '1 There are understandable reasons why arguments occur about language.', answer: 'yes' },
      { id: 2, type: 'yes_no_not_given', text: '2 People feel more strongly about language education than about small differences in language usage.', answer: 'no' }
    ]
  },
  {
    title: 'Tidal Power',
    passage: `Operating on the same principle as wind turbines...`,
    image: {
      heading: 'An Undersea Turbine',
      url: '/tests/reading/reading1/Capture.PNG'
    },
    questions: [
      { id: 14, type: 'matching_paragraphs', text: '14 the location of the first test site', answer: 'C' }
    ]
  },
  {
    title: 'Information Theory - The Big Idea',
    passage: `In April 2002 an event took place...`,
    questions: [
      { id: 27, type: 'matching_paragraphs', text: '27 an explanation of the factors affecting the transmission of information', answer: 'D' }
    ]
  }
]);

database.prepare(`
  INSERT INTO test_modules (id, test_id, module_type, config, questions)
  VALUES (?, ?, ?, ?, ?)
`).run(moduleId, testId, 'reading', config, questions);

console.log('Test created successfully with ID:', testId);
