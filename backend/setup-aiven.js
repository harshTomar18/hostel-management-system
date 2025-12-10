require('dotenv').config();
const mysql = require('mysql2/promise');

async function createTables() {
    let connection;

    try {
        console.log('🔌 Connecting to Aiven MySQL...');

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            ssl: { rejectUnauthorized: false },
            connectTimeout: 20000
        });

        console.log('✅ Connected to database');

        // Create users table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('✅ Created users table');

        // Create rooms table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        capacity INT NOT NULL,
        occupied INT DEFAULT 0,
        status VARCHAR(50) NOT NULL,
        floor INT NOT NULL
      )
    `);
        console.log('✅ Created rooms table');

        // Create students table
        await connection.execute(`
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
      )
    `);
        console.log('✅ Created students table');

        // Create complaints table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS complaints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student VARCHAR(255) NOT NULL,
        room VARCHAR(50),
        issue TEXT NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        priority VARCHAR(20) DEFAULT 'Medium'
      )
    `);
        console.log('✅ Created complaints table');

        // Create notices table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS notices (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        date DATE NOT NULL,
        author VARCHAR(255),
        type VARCHAR(50)
      )
    `);
        console.log('✅ Created notices table');

        // Create staff table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(100),
        contact VARCHAR(20),
        email VARCHAR(255)
      )
    `);
        console.log('✅ Created staff table');

        console.log('\n🎉 All tables created successfully!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Connection closed');
        }
    }
}

createTables();
