const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'submissions.db'), (err) => {
  if (err) console.error(err);
  else console.log('✅ Connected to SQLite database (submissions.db)');
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// === API ENDPOINT ===
app.post('/api/collaborate', (req, res) => {
  const { name, email, type, message } = req.body;

  if (!name || !email || !type || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }

  const sql = `INSERT INTO submissions (name, email, type, message) VALUES (?, ?, ?, ?)`;
  
  db.run(sql, [name, email, type, message], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
    console.log(`📩 New collaboration request from ${name} (${email}) - Type: ${type}`);
    res.json({ message: '✅ Collaboration request submitted successfully!' });
  });
});

// Fallback to index.html for direct access
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 GENA Initiative server running on http://localhost:${PORT}`);
});