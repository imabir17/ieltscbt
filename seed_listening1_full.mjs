import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('local.db');

// check if test exists or insert it
const stmt = db.prepare('SELECT id FROM tests WHERE name = ?');
let test = stmt.get('IELTS Listening Test 1');

if (!test) {
  const testId = randomUUID();
  const insertStmt = db.prepare(`
    INSERT INTO tests (id, name, type, owner_center_id)
    VALUES (?, ?, ?, ?)
  `);
  insertStmt.run(testId, 'IELTS Listening Test 1', 'Academic', null);
  test = { id: testId };
}

const testId = test.id;

// delete existing module
db.prepare('DELETE FROM test_modules WHERE test_id = ? AND module_type = ?').run(testId, 'listening');

const config = JSON.stringify({ audioUrl: '/tests/listening/listening1/1_we.mp3' });

const questions = JSON.stringify([
  {
    title: 'Part 1',
    groups: [
      {
        instructions: "Complete the table below. Write ONE WORD OR A NUMBER.",
        questions: [
          { id: 1, type: 'form_completion', text: '– Just [1] .meters from beach – Near shops', answer: '300' },
          { id: 2, type: 'form_completion', text: '[2] Apartments', answer: 'sunshade' },
          { id: 3, type: 'form_completion', text: 'Greek paintings and [3]', answer: 'balcony' },
          { id: 4, type: 'form_completion', text: '– Overlooking [4] – Near a supermarket and a disco', answer: 'forest(s)' },
          { id: 5, type: 'form_completion', text: '£ [5]', answer: '319' }
        ]
      },
      {
        instructions: "Complete the table below. Write ONE WORD OR A NUMBER.\n\nGREEK ISLAND HOLIDAYS",
        questions: [
          { id: 6, type: 'form_completion', text: 'Cancellation £ [6]', answer: '10,000' },
          { id: 7, type: 'form_completion', text: '£ 600 additional benefit allows a [7] to travel to resort', answer: 'relative' },
          { id: 8, type: 'form_completion', text: '[8] departure', answer: 'missed' },
          { id: 9, type: 'form_completion', text: 'Up to £ 3000 £ 500 for one [9]', answer: 'item' },
          { id: 10, type: 'form_completion', text: 'Name of assistant manager: Ben [10]', answer: 'Ludlow' }
        ]
      }
    ]
  },
  {
    title: 'Part 2',
    groups: [
      {
        instructions: "Choose the correct letter A, B or C.\n\nWINRIDGE FOREST RAILWAY PARK",
        questions: [
          { 
            id: 11, 
            type: 'multiple_choice', 
            text: '11. Simon’s idea for a theme park came from', 
            options: ['A his childhood hobby', 'B his interest in landscape design', 'C his visit to another park'],
            answer: 'C' 
          },
          { 
            id: 12, 
            type: 'multiple_choice', 
            text: '12. When they started, the family decided to open the park only when', 
            options: ['A the weather was expected to be good', 'B the children weren’t at school', 'C there were fewer farming commitments'],
            answer: 'A' 
          },
          { 
            id: 13, 
            type: 'multiple_choice', 
            text: '13. Since opening, the park has had', 
            options: ['A 50,000 visitors', 'B 1,000,000 visitors', 'C 1,500,000 visitors'],
            answer: 'C' 
          }
        ]
      },
      {
        instructions: "What is currently the main area of work of each of the following people?\n\nChoose FIVE answers from the box and write the correct letter A-H next to questions 14-18.\n\nArea of work\nA advertising\nB animal care\nC building\nD educational links\nE engine maintenance\nF food and drink\nG sales\nH staffing",
        questions: [
          { id: 14, type: 'fill_in_the_blank', text: '14. Simon', answer: 'E' },
          { id: 15, type: 'fill_in_the_blank', text: '15. Liz', answer: 'H' },
          { id: 16, type: 'fill_in_the_blank', text: '16. Sarah', answer: 'F' },
          { id: 17, type: 'fill_in_the_blank', text: '17. Duncan', answer: 'C' },
          { id: 18, type: 'fill_in_the_blank', text: '18. Judith', answer: 'G' }
        ]
      },
      {
        instructions: "Complete the table below. Write ONE WORD OR A NUMBER.",
        questions: [
          { id: 19, type: 'form_completion', text: '[19] sq mt', answer: '120' },
          { id: 20, type: 'form_completion', text: '[20] yaer olds', answer: '5-12' }
        ]
      }
    ]
  },
  {
    title: 'Part 3',
    groups: [
      {
        instructions: "Complete the notes below. Write NO MORE THAN TWO WORDS OR A NUMBER.\n\nStudy Skills Tutorial – Caroline Benning",
        questions: [
          { id: 21, type: 'form_completion', text: 'Dissertation topic: the [21]', answer: 'fishing industry' },
          { id: 22, type: 'form_completion', text: 'Strengths: [22]', answer: 'statistics' },
          { id: 23, type: 'form_completion', text: 'Poor [23] skills', answer: 'note-taking' },
          { id: 24, type: 'form_completion', text: 'Increase [24]', answer: 'confidence' },
          { id: 25, type: 'form_completion', text: 'Dissertations tend to contain the same [25]', answer: 'ideas' },
          { id: 26, type: 'form_completion', text: 'Use the [26] service', answer: 'student support' },
          { id: 27, type: 'form_completion', text: 'Limited [27]', answer: 'places' },
          { id: 28, type: 'form_completion', text: 'Can be too [28]', answer: 'general' },
          { id: 29, type: 'form_completion', text: 'Recommendations: use a card index, Read all notes [29]', answer: '3 times' },
          { id: 30, type: 'form_completion', text: 'Next tutorial date: [30] January', answer: '25' }
        ]
      }
    ]
  },
  {
    title: 'Part 4',
    groups: [
      {
        instructions: "Choose the correct letter, A, B or C.",
        questions: [
          { 
            id: 31, 
            type: 'multiple_choice', 
            text: '31. The owners of the underground house', 
            options: ['A had no experience of living in a rural area', 'B were interested in environmental issues', 'C wanted a professional project manager'],
            answer: 'B' 
          },
          { 
            id: 32, 
            type: 'multiple_choice', 
            text: '32. What does the speaker say about the site of the house?', 
            options: ['A The land was quite cheap', 'B Stone was being extracted nearby', 'C It was in a completely unspoilt area'],
            answer: 'A' 
          }
        ]
      },
      {
        instructions: "Complete the notes below. Write NO MORE THAN TWO WORDS AND/ OR A NUMBER.\n\nTHE UNDERGROUND HOUSE",
        questions: [
          { id: 33, type: 'form_completion', text: '• The south-facing side was constructed of two layers of [33]', answer: 'glass' },
          { id: 34, type: 'form_completion', text: '• A layer of foam was used to improve the [34] of the building', answer: 'insulation' },
          { id: 35, type: 'form_completion', text: '• To increase the light, the building has many internal mirrors and [35]', answer: 'windows' },
          { id: 36, type: 'form_completion', text: '• In future, the house may produce more [36] than it needs', answer: 'electricity' },
          { id: 37, type: 'form_completion', text: '• Recycled wood was used for the [37] of the house', answer: 'floor(s)' },
          { id: 38, type: 'form_completion', text: '• The system for processing domestic [38] is organic', answer: 'waste' },
          { id: 39, type: 'form_completion', text: '• The use of large quantities of [39] in construction was environmentally harmful', answer: 'concrete' },
          { id: 40, type: 'form_completion', text: '• But the house will have paid its ‘environmental debt’ within [40]', answer: '15 years' }
        ]
      }
    ]
  }
]);

const moduleId = randomUUID();

db.prepare(`
  INSERT INTO test_modules (id, test_id, module_type, config, questions)
  VALUES (?, ?, ?, ?, ?)
`).run(moduleId, testId, 'listening', config, questions);

console.log('Successfully added IELTS Listening Test 1 module to the database!');
