const db = require('./db');

const createTableSql = `
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  occupied INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Available',
  floor INT NOT NULL
)`;

db.query(createTableSql, (err, result) => {
    if (err) {
        console.error('❌ Error creating table:', err);
    } else {
        console.log('✅ Rooms table created or already exists');
    }
    db.end();
});
