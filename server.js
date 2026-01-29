const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Database connection configuration
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// --- ROUTES FOR 'BOOKS' ---

// 1. GET ALL Books
app.get('/books', async (req, res) => {
  try {
    // We join tables to give a nice response with Author names instead of just IDs
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

// 2. GET Book BY ID
app.get('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. CREATE a Book
app.post('/books', async (req, res) => {
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

// 4. UPDATE a Book
app.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price } = req.body;
    const result = await pool.query(
      'UPDATE books SET title = $1, price = $2 WHERE id = $3 RETURNING *',
      [title, price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. DELETE a Book
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});