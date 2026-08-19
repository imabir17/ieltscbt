import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('local.db');

const row = db.prepare('SELECT questions FROM test_modules WHERE module_type = ?').get('listening');
if (!row) {
  console.log("Listening module not found");
  process.exit(1);
}

const sections = JSON.parse(row.questions);

// Part 1: Q1-5 and Q6-10 are already in two groups
sections[0].groups[0].table = {
  headers: ["Apartments", "Facilities", "Other Information", "Cost"],
  rows: [
    ["Rose Garden Apartments", "Studio Flat", "Entertainment programme: Greek dancing", "£ 219"],
    ["Blue Bay Apartments", "Large salt water swimming pool", "– Just (1)............... .meters from beach– Near shops", "£ 275"],
    ["(2)...............Apartments", "Terrace", "Watersports", "£ 490"],
    ["The Grand", "Greek paintings and (3)...............", "– Overlooking (4)...............– Near a supermarket and a disco", "(5)\n£..............."]
  ]
};

sections[0].groups[1].table = {
  headers: ["Insurance Benefits", "Maximum Amount"],
  rows: [
    ["Cancellation", "(6) £..............."],
    ["Hospital", "£ 600 additional benefit allows a (7)............... to travel to resort"],
    ["(8)............... departure", "Up to £ 1000 depends on reason"],
    ["Personal belongings", "Up to £ 3000 £ 500 for one (9)..............."],
    ["Name of assistant manager: Ben (10)...............", ""]
  ]
};

// Part 2: Q19-20 is the 3rd group in sections[1]
sections[1].groups[2].table = {
  headers: ["Feature", "Size", "Biggest Challenge", "Target Age Group"],
  rows: [
    ["Railway", "1.2 km", "Making tunnels", ""],
    ["Go-kart arena", "(19)............... sq mt", "Removing mounds on track", "(20)............... yaer olds"]
  ]
};

// Part 3: Currently a single group for 21-30. We must split it.
const part3Group = sections[2].groups[0];
const instructions = part3Group.instructions;
const q21_23 = part3Group.questions.filter(q => q.id >= 21 && q.id <= 23);
const q24_28 = part3Group.questions.filter(q => q.id >= 24 && q.id <= 28);
const q29_30 = part3Group.questions.filter(q => q.id >= 29 && q.id <= 30);

sections[2].groups = [
  {
    instructions: instructions,
    questions: q21_23
  },
  {
    instructions: "",
    table: {
      headers: ["Possible strategy", "Benefits", "Problems"],
      rows: [
        ["Peer group discussion", "Increase (24)...............", "Dissertations tend to contain the same (25)..............."],
        ["Use the (26)............... service", "Provides structured programme", "Limited (27)..............."],
        ["Consult study skill books", "Are a good source of reference", "Can be too (28)..............."]
      ]
    },
    questions: q24_28
  },
  {
    instructions: "Recommendations and Next tutorial date:",
    questions: q29_30
  }
];

// Update the database
const updateStmt = db.prepare('UPDATE test_modules SET questions = ? WHERE module_type = ?');
updateStmt.run(JSON.stringify(sections), 'listening');
console.log("Database updated successfully.");
