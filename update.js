const db = require('better-sqlite3')('./local.db');
db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run('$2b$10$Hlvwz.c5GcriBHZvsxzSmOJU.muDa63Fhi0vGpsUjbZE31IwcVo/2', 'superadmin-1');
console.log('Fixed DB successfully');
