// Quick setup script to create database and tables
const mysql = require('mysql');

// First, connect without specifying a database to create it
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
});

connection.connect((err) => {
    if (err) {
        console.error('❌ MySQL connection failed:', err.message);
        console.log('\n💡 Make sure MySQL is running and credentials in .env are correct');
        process.exit(1);
    }

    console.log('✅ Connected to MySQL');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'sampledb';

    connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
        if (err) {
            console.error('❌ Failed to create database:', err.message);
            connection.end();
            process.exit(1);
        }

        console.log(`✅ Database '${dbName}' ready`);

        // Switch to the database
        connection.query(`USE ${dbName}`, (err) => {
            if (err) {
                console.error('❌ Failed to use database:', err.message);
                connection.end();
                process.exit(1);
            }

            // Create all tables
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

            connection.query(createTablesSQL, (err) => {
                if (err) {
                    console.error('❌ Failed to create tables:', err.message);
                    connection.end();
                    process.exit(1);
                }

                console.log('✅ All tables created successfully!');
                console.log('\n📊 Tables created:');
                console.log('   - users');
                console.log('   - rooms');
                console.log('   - students');
                console.log('   - complaints');
                console.log('   - notices');
                console.log('   - staff');
                console.log('\n🎉 Database setup complete! You can now start the server.');

                connection.end();
                process.exit(0);
            });
        });
    });
});
