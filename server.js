const express = require('express');
const mysql = require('mysql2/promise');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cookieParser());

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'rootpassword',
    database: process.env.DB_NAME || 'rest_api_db',
    port: 3306
};

async function getDbConnection() {
    return await mysql.createConnection(dbConfig);
}

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

    try {
        const connection = await getDbConnection();
        const [existing] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            await connection.end();
            return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        await connection.end();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });
    
    try {
        const connection = await getDbConnection();
        const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        await connection.end();

        if (users.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            res.cookie('user', username, { httpOnly: true, maxAge: 3600000 });
            res.status(200).json({ message: "Logged in successfully" });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('user');
    res.status(200).json({ message: "Logged out successfully" });
});

app.get('/api/is-logged', (req, res) => {
    const user = req.cookies.user;
    if (user) {
        res.json({ username: user });
    } else {
        res.json({ username: null }); 
    }
});

// ==========================================
// BOOKS API ENDPOINTS
// ==========================================

// Get all books
app.get('/api/books', async (req, res) => {
    try {
        const connection = await getDbConnection();
        const limit = req.query.limit ? parseInt(req.query.limit) : null;
        let query = 'SELECT * FROM books';
        let params = [];
        if (limit) {
            query += ' LIMIT ?';
            params.push(limit);
        }
        const [rows] = await connection.execute(query, params);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getDbConnection();
        const [rows] = await connection.execute('SELECT * FROM books WHERE id = ?', [id]);
        await connection.end();
        if (rows.length === 0) return res.status(404).json({ error: "Book not found" });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Create a book
app.post('/api/books', async (req, res) => {
    try {
        // Changed to reflect book data
        const { title, author, price, description } = req.body;
        if (!title || !author || !price) {
            return res.status(400).json({ error: "Invalid body: title, author, and price are required" });
        }

        const connection = await getDbConnection();
        const [result] = await connection.execute(
            'INSERT INTO books (title, author, price, description) VALUES (?, ?, ?, ?)',
            [title, author, price, description || null]
        );
        await connection.end();
        res.status(201).json({ id: result.insertId, title, author, price, description });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Update a book
app.put('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, price, description } = req.body;
        const connection = await getDbConnection();
        
        const [check] = await connection.execute('SELECT * FROM books WHERE id = ?', [id]);
        if (check.length === 0) {
            await connection.end();
            return res.status(404).json({ error: "Book not found" });
        }

        await connection.execute(
            'UPDATE books SET title = ?, author = ?, price = ?, description = ? WHERE id = ?',
            [title, author, price, description, id]
        );
        await connection.end();
        res.json({ id, title, author, price, description, message: "Updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// Delete a book
app.delete('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getDbConnection();
        
        const [check] = await connection.execute('SELECT * FROM books WHERE id = ?', [id]);
        if (check.length === 0) {
            await connection.end();
            return res.status(404).json({ error: "Book not found" });
        }

        await connection.execute('DELETE FROM books WHERE id = ?', [id]);
        await connection.end();
        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));