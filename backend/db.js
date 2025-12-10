require('dotenv').config();
const mysql = require('mysql');

// Use connection pool instead of single connection to handle disconnections
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sampledb',
  multipleStatements: false,
  connectTimeout: 10000,
  acquireTimeout: 10000,
  waitForConnections: true,
  queueLimit: 0
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
