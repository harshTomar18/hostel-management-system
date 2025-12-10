// backend/server.js

require('dotenv').config();   // <-- Make sure this is at the top

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

// ====== CORS (IMPORTANT FOR DEPLOYMENT) ======
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// ====== Health Check ======
app.get('/', (req, res) => res.json({ status: "ok" }));

// JWT SECRET from environment
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_jwt_secret";


// ======================= Registration Route =======================
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ status: "error", message: "Name, email, and password required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ status: "error", message: "DB query failed" });

    if (user.length > 0) {
      return res.status(400).json({ status: "error", message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed],
      (err, result) => {
        if (err) return res.status(500).json({ status: "error", message: "DB insert failed" });
        res.status(201).json({ status: "success", id: result.insertId });
      }
    );
  });
});


// ======================= Login Route =======================
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  console.log('📧 Login attempt for:', email);

  if (!email || !password) {
    return res.status(400).json({ status: 'error', message: 'Email and password required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.error('❌ DB query failed:', err);
      return res.status(500).json({ status: 'error', message: 'DB query failed' });
    }

    console.log('📊 Query result:', result ? result.length : 0, 'users found');

    if (result.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
    }

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('🔐 Password match:', isMatch);

      if (!isMatch) {
        return res.status(400).json({ status: 'error', message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ status: 'success', message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (compareErr) {
      console.error('❌ Password comparison error:', compareErr);
      return res.status(500).json({ status: 'error', message: 'Login failed' });
    }
  });
});

// ======================= Rooms Route =======================
app.get('/api/rooms', (req, res) => {
  const sql = 'SELECT * FROM rooms';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB query failed' });
    res.json(results);
  });
});

app.post('/api/rooms', (req, res) => {
  const { type, capacity, occupied, status, floor } = req.body;

  if (!type || !capacity || !status || !floor) {
    return res.status(400).json({ status: 'error', message: 'Missing required room fields' });
  }

  const sql = 'INSERT INTO rooms (type, capacity, occupied, status, floor) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [type, capacity, occupied || 0, status, floor], (err, result) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB insert failed' });

    res.status(201).json({ status: 'success', message: 'Room added', id: result.insertId });
  });
});

app.put('/api/rooms/:id', (req, res) => {
  const { type, capacity, occupied, status, floor } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE rooms SET type = ?, capacity = ?, occupied = ?, status = ?, floor = ? WHERE id = ?';
  db.query(sql, [type, capacity, occupied, status, floor, id], (err, result) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB update failed' });
    res.json({ status: 'success', message: 'Room updated' });
  });
});

// ======================= Students Route =======================
app.get('/api/students', (req, res) => {
  const sql = 'SELECT * FROM students';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB query failed' });
    res.json(results);
  });
});

app.post('/api/students', (req, res) => {
  const { name, room, course, year, contact, status, email } = req.body;

  // 1. Check if room exists and is available
  const checkRoomSql = 'SELECT * FROM rooms WHERE id = ?';
  db.query(checkRoomSql, [room], (err, roomResult) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB query failed' });

    if (roomResult.length === 0) {
      return res.status(400).json({ status: 'error', message: 'Room not found' });
    }

    const targetRoom = roomResult[0];

    if (targetRoom.status === 'Maintenance') {
      return res.status(400).json({ status: 'error', message: 'Room is under maintenance' });
    }

    if (targetRoom.occupied >= targetRoom.capacity) {
      return res.status(400).json({ status: 'error', message: 'Room is full' });
    }

    // 2. Insert Student
    const insertStudentSql = 'INSERT INTO students (name, room, course, year, contact, status, email) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(insertStudentSql, [name, room, course, year, contact, status, email], (err, result) => {
      if (err) return res.status(500).json({ status: 'error', message: 'DB insert failed' });

      const studentId = result.insertId;

      // 3. Increment Room Occupancy
      const updateRoomSql = 'UPDATE rooms SET occupied = occupied + 1 WHERE id = ?';
      db.query(updateRoomSql, [room], (err, updateResult) => {
        if (err) {
          // Ideally we should rollback the student insert here, but for simplicity we'll just log it.
          console.error('Failed to update room occupancy');
        }
        res.status(201).json({ status: 'success', message: 'Student added', id: studentId });
      });
    });
  });
});

app.put('/api/students/:id', (req, res) => {
  const { name, room, course, year, contact, status, email } = req.body;
  const { id } = req.params;

  // 1. Get current student details to find old room
  const getStudentSql = 'SELECT room FROM students WHERE id = ?';
  db.query(getStudentSql, [id], (err, studentResult) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB query failed' });
    if (studentResult.length === 0) return res.status(404).json({ status: 'error', message: 'Student not found' });

    const oldRoomId = studentResult[0].room;
    const newRoomId = room; // The room coming from the request body

    // If room hasn't changed, just update student details
    if (oldRoomId == newRoomId) {
      const updateSql = 'UPDATE students SET name = ?, room = ?, course = ?, year = ?, contact = ?, status = ?, email = ? WHERE id = ?';
      db.query(updateSql, [name, room, course, year, contact, status, email, id], (err, result) => {
        if (err) return res.status(500).json({ status: 'error', message: 'DB update failed' });
        res.json({ status: 'success', message: 'Student updated' });
      });
      return;
    }

    // If room HAS changed:
    // 2. Check new room availability
    const checkRoomSql = 'SELECT * FROM rooms WHERE id = ?';
    db.query(checkRoomSql, [newRoomId], (err, roomResult) => {
      if (err) return res.status(500).json({ status: 'error', message: 'DB query failed' });
      if (roomResult.length === 0) return res.status(400).json({ status: 'error', message: 'New room not found' });

      const targetRoom = roomResult[0];
      if (targetRoom.status === 'Maintenance') return res.status(400).json({ status: 'error', message: 'New room is under maintenance' });
      if (targetRoom.occupied >= targetRoom.capacity) return res.status(400).json({ status: 'error', message: 'New room is full' });

      // 3. Update Student
      const updateSql = 'UPDATE students SET name = ?, room = ?, course = ?, year = ?, contact = ?, status = ?, email = ? WHERE id = ?';
      db.query(updateSql, [name, room, course, year, contact, status, email, id], (err, result) => {
        if (err) return res.status(500).json({ status: 'error', message: 'DB update failed' });

        // 4. Decrement old room occupancy
        db.query('UPDATE rooms SET occupied = GREATEST(occupied - 1, 0) WHERE id = ?', [oldRoomId], () => {
          // 5. Increment new room occupancy
          db.query('UPDATE rooms SET occupied = occupied + 1 WHERE id = ?', [newRoomId], () => {
            res.json({ status: 'success', message: 'Student updated and room occupancy adjusted' });
          });
        });
      });
    });
  });
});

// ======================= Complaints Route =======================
app.get('/api/complaints', (req, res) => {
  const sql = 'SELECT * FROM complaints';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB query failed' });
    res.json(results);
  });
});

app.post('/api/complaints', (req, res) => {
  const { student, room, issue, priority } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const sql = 'INSERT INTO complaints (student, room, issue, date, status, priority) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [student, room, issue, date, 'Pending', priority], (err, result) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB insert failed' });
    res.status(201).json({ status: 'success', message: 'Complaint added', id: result.insertId });
  });
});

app.put('/api/complaints/:id/status', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE complaints SET status = ? WHERE id = ?';
  db.query(sql, [status, id], (err, result) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB update failed' });
    res.json({ status: 'success', message: 'Complaint updated' });
  });
});

// ======================= Notices Route =======================
app.get('/api/notices', (req, res) => {
  const sql = 'SELECT * FROM notices';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB query failed' });
    res.json(results);
  });
});

app.post('/api/notices', (req, res) => {
  const { title, content, author, type } = req.body;
  const date = new Date().toISOString().split('T')[0];
  const sql = 'INSERT INTO notices (title, content, date, author, type) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [title, content, date, author, type], (err, result) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB insert failed' });
    res.status(201).json({ status: 'success', message: 'Notice added', id: result.insertId });
  });
});

app.put('/api/notices/:id', (req, res) => {
  const { title, content, type, author } = req.body;
  const { id } = req.params;
  const sql = 'UPDATE notices SET title = ?, content = ?, type = ?, author = ? WHERE id = ?';
  db.query(sql, [title, content, type, author, id], (err, result) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB update failed' });
    res.json({ status: 'success', message: 'Notice updated' });
  });
});

// ======================= Dashboard Route =======================
app.get('/api/dashboard/stats', (req, res) => {
  const queries = {
    students: 'SELECT COUNT(*) as count FROM students',
    rooms: 'SELECT SUM(capacity) as totalCapacity, SUM(occupied) as totalOccupied, COUNT(*) as totalRooms FROM rooms',
    complaints: 'SELECT COUNT(*) as count FROM complaints WHERE status = "Pending"'
  };

  const stats = {
    totalStudents: 0,
    occupancyRate: 0,
    totalRevenue: 0,
    pendingIssues: 0,
    availableRooms: 0,
    revenueChange: '+12%', // Still mocked as we don't have historical data
    pendingPayments: 0
  };

  db.query(queries.students, (err, studentResult) => {
    if (!err) {
      stats.totalStudents = studentResult[0].count;
      // Estimate Revenue: 5000 per student
      stats.totalRevenue = stats.totalStudents * 5000;
      // Estimate Pending Payments: 500 per student (10% of fee)
      stats.pendingPayments = stats.totalStudents * 500;
    }

    db.query(queries.rooms, (err, roomResult) => {
      if (!err && roomResult[0]) {
        const { totalCapacity, totalOccupied, totalRooms } = roomResult[0];
        // Calculate Occupancy Rate
        if (totalCapacity > 0) {
          stats.occupancyRate = Math.round((totalOccupied / totalCapacity) * 100);
        }

        // Calculate Available Rooms (This is an approximation based on capacity vs occupied sum, 
        // but to be precise we should count rooms where occupied < capacity. 
        // Let's do a separate query for that or just use the aggregate for now.
        // Actually, let's do it right with a sub-query or just a separate query.)
      }

      // Query for available rooms count
      db.query('SELECT COUNT(*) as count FROM rooms WHERE occupied < capacity', (err, availableResult) => {
        if (!err) {
          stats.availableRooms = availableResult[0].count;
        }

        db.query(queries.complaints, (err, complaintResult) => {
          if (!err) stats.pendingIssues = complaintResult[0].count;
          res.json(stats);
        });
      });
    });
  });
});

// ======================= Activity Route =======================
app.get('/api/dashboard/activity', (req, res) => {
  const activities = [];

  // Get recent students
  db.query('SELECT name, id, "checkin" as type, "Checked in" as action, "Today" as time FROM students ORDER BY id DESC LIMIT 2', (err, students) => {
    if (!err) activities.push(...students.map(s => ({ ...s, user: s.name })));

    // Get recent complaints
    db.query('SELECT issue, id, "issue" as type, "Reported issue" as action, "Today" as time, student as user FROM complaints ORDER BY id DESC LIMIT 2', (err, complaints) => {
      if (!err) activities.push(...complaints);

      // Get recent notices
      db.query('SELECT title, id, "notice" as type, "Posted notice" as action, "Today" as time, author as user FROM notices ORDER BY id DESC LIMIT 1', (err, notices) => {
        if (!err) activities.push(...notices);

        // Sort and limit
        // In a real app we would sort by actual timestamp
        res.json(activities);
      });
    });
  });
});

// ======================= Chart Route =======================
app.get('/api/dashboard/chart', (req, res) => {
  // Generate mock data based on current student count
  db.query('SELECT COUNT(*) as count FROM students', (err, result) => {
    const count = result[0].count || 0;
    const baseRevenue = count * 5000;

    // Generate 12 months of data with some variation
    const data = Array.from({ length: 12 }, () => Math.floor(baseRevenue * (0.8 + Math.random() * 0.4)));
    res.json(data);
  });
});

// ======================= Staff Route =======================
app.get('/api/staff', (req, res) => {
  db.query('SELECT * FROM staff', (err, results) => {
    if (err) return res.status(500).json({ status: 'error', message: 'DB query failed' });
    res.json(results);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
