import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./local.db');

const testRow = db.prepare("SELECT id FROM tests WHERE name = 'IELTS Reading Test 3'").get();
const row = db.prepare("SELECT id, questions FROM test_modules WHERE module_type = 'reading' AND test_id = ?").get(testRow.id);

const secs = JSON.parse(row.questions);
const p3 = secs[2]; // Reading Passage 3

// Replace the flow-chart group (group index 2, questions 34-39) with a group
// that has a flow_chart_passage field for inline rendering
p3.groups[2] = {
  instructions: `Complete the flow-chart below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage.\n\nMethod of determining where the ancestors of turtles and tortoises come from`,
  flow_chart_passage: `Step 1: 71 species of living turtles and tortoises were examined and a total of [34] were taken from the bones of their forelimbs.
Step 2: The data was recorded on a [35] (necessary for comparing the information).
Outcome: Land tortoises were represented by a dense [36] of points towards the top. Sea turtles were grouped together in the bottom part.
Step 3: The same data was collected from some living [37] species and added to the other results. Outcome: The points for these species turned out to be positioned about [38] up the triangle between the land tortoises and the sea turtles.
Step 4: Bones of P. quenstedti and P. talampayensis were examined in a similar way and the results added.
Outcome: The position of the points indicated that both these ancient creatures were [39]`,
  questions: [
    { id: 34, type: 'flow_chart', text: '', answer: '3 measurements' },
    { id: 35, type: 'flow_chart', text: '', answer: 'triangular graph' },
    { id: 36, type: 'flow_chart', text: '', answer: 'cluster' },
    { id: 37, type: 'flow_chart', text: '', answer: 'amphibious' },
    { id: 38, type: 'flow_chart', text: '', answer: 'half way' },
    { id: 39, type: 'flow_chart', text: '', answer: 'dry land tortoises' },
  ]
};

db.prepare("UPDATE test_modules SET questions = ? WHERE id = ?").run(JSON.stringify(secs), row.id);
console.log('Flow chart group updated successfully.');
