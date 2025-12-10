require('dotenv').config();
const mysql = require('mysql2');

// Use connection pool instead of single connection to handle disconnections
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sampledb',
  multipleStatements: false,
  connectTimeout: 10000,
  waitForConnections: true,
  queueLimit: 0,
  ssl: process.env.DB_HOST && process.env.DB_HOST.includes('aivencloud') ? { rejectUnauthorized: false } : undefined
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
    return;
  }
  console.log('✅ MySQL connected');
  connection.release();
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('❌ MySQL pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔄 Reconnecting to MySQL...');
  }
});

module.exports = pool;
