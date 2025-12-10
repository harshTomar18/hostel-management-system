const db = require('./db');

const createStudentsTable = `
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  room VARCHAR(50),
  course VARCHAR(100),
  year VARCHAR(20),
  contact VARCHAR(20),
  status VARCHAR(20) DEFAULT 'Active',
  email VARCHAR(100)
)`;

const createComplaintsTable = `
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student VARCHAR(100) NOT NULL,
  room VARCHAR(50),
  issue TEXT NOT NULL,
  date DATE,
  status VARCHAR(20) DEFAULT 'Pending',
  priority VARCHAR(20) DEFAULT 'Medium'
)`;

const createNoticesTable = `
CREATE TABLE IF NOT EXISTS notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  date DATE,
  author VARCHAR(100),
  type VARCHAR(50)
)`;

const queries = [createStudentsTable, createComplaintsTable, createNoticesTable];

let completed = 0;

queries.forEach((query) => {
    db.query(query, (err, result) => {
        if (err) {
            console.error('❌ Error creating table:', err);
        } else {
            console.log('✅ Table created or already exists');
        }
        completed++;
        if (completed === queries.length) {
            db.end();
        }
    });
});
