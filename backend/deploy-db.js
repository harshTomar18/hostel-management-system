// Script to initialize database tables for production deployment
require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sampledb',
    multipleStatements: true
});

const createTablesSQL = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  occupied INT DEFAULT 0,
  status VARCHAR(50) NOT NULL,
  floor INT NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  room INT,
  course VARCHAR(100),
  year VARCHAR(50),
  contact VARCHAR(20),
  status VARCHAR(50),
  email VARCHAR(255),
  FOREIGN KEY (room) REFERENCES rooms(id)
);

CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student VARCHAR(255) NOT NULL,
  room VARCHAR(50),
  issue TEXT NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  priority VARCHAR(20) DEFAULT 'Medium'
);

CREATE TABLE IF NOT EXISTS notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author VARCHAR(255),
  type VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  contact VARCHAR(20),
  email VARCHAR(255)
);
`;

db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    }

    console.log('✅ Connected to database');

    db.query(createTablesSQL, (err, results) => {
        if (err) {
            console.error('❌ Failed to create tables:', err);
            db.end();
            process.exit(1);
        }

        console.log('✅ All tables created successfully!');
        console.log('📊 Tables: users, rooms, students, complaints, notices, staff');

        db.end();
        process.exit(0);
    });
});
