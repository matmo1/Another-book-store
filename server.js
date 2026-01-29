const express = require('express');
const { Pool } = require('pg');
const session = require('express-session');
const crypto = require('node:crypto');

const app = express();
app.use(express.json());

// 1. Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// --- AUTHENTICATION LOGIC ---

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// 2. Administrators Array (Hardcoded)
// Default user: 'admin', password: 'password123'
const admins = [
  {
    username: 'admin',
    passwordHash: 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'
  }
];

// 3. Login Endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const admin = admins.find(u => u.username === username);

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Check password
  const inputHash = hashPassword(password);
  
  if (inputHash === admin.passwordHash) {
    req.session.user = { username: admin.username, role: 'admin' };
    return res.json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

// 4. Middleware: isAuthenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: You must be logged in." });
};

// --- BOOK ROUTES ---

// Public Route: Anyone can see books
app.get('/books', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.id, b.title, b.price, a.name as author, g.name as genre 
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN genres g ON b.genre_id = g.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public Route: Get by ID
app.get('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected Route: Create Book (Needs Login)
app.post('/books', isAuthenticated, async (req, res) => {
  try {
    const { title, price, author_id, genre_id } = req.body;
    const result = await pool.query(
      'INSERT INTO books (title, price, author_id, genre_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, price, author_id, genre_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected Route: Update Book (Needs Login)
app.put('/books/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;
    const result = await pool.query(
      'UPDATE books SET title = $1, price = $2 WHERE id = $3 RETURNING *',
      [title, price, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected Route: Delete Book (Needs Login)
app.delete('/books/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});