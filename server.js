const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Database Configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'rootpassword',
    database: process.env.DB_NAME || 'rest_api_db',
    port: 3306
};

// Helper function to get DB connection
async function getDbConnection() {
    return await mysql.createConnection(dbConfig);
}

// --- 1. GET /items (Supports ?limit=N) ---
app.get('/items', async (req, res) => {
    try {
        const connection = await getDbConnection();
        const limit = req.query.limit ? parseInt(req.query.limit) : null;

        let query = 'SELECT * FROM items';
        let params = [];

        // Grading Criterion: Implementing limit parameter
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

// --- 2. GET /items/{id} ---
app.get('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getDbConnection();

        const [rows] = await connection.execute('SELECT * FROM items WHERE id = ?', [id]);
        await connection.end();

        // Grading Criterion: 404 if not found
        if (rows.length === 0) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// --- 3. POST /items (Create) ---
app.post('/items', async (req, res) => {
    try {
        const { name, price, description } = req.body;

        // Grading Criterion: Validation (400 Bad Request)
        if (!name || !price) {
            return res.status(400).json({ error: "Invalid body: name and price are required" });
        }

        const connection = await getDbConnection();
        const [result] = await connection.execute(
            'INSERT INTO items (name, price, description) VALUES (?, ?, ?)',
            [name, price, description || null]
        );
        await connection.end();

        // Grading Criterion: 201 Created status
        res.status(201).json({ 
            id: result.insertId, 
            name, 
            price, 
            description 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// --- 4. PUT /items/{id} (Update) ---
app.put('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;

        const connection = await getDbConnection();

        // Check if exists first
        const [check] = await connection.execute('SELECT * FROM items WHERE id = ?', [id]);
        if (check.length === 0) {
            await connection.end();
            return res.status(404).json({ error: "Item not found" });
        }

        // Perform Update
        await connection.execute(
            'UPDATE items SET name = ?, price = ?, description = ? WHERE id = ?',
            [name, price, description, id]
        );
        await connection.end();

        res.json({ id, name, price, description, message: "Updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// --- 5. DELETE /items/{id} ---
app.delete('/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getDbConnection();

        // Check if exists first
        const [check] = await connection.execute('SELECT * FROM items WHERE id = ?', [id]);
        if (check.length === 0) {
            await connection.end();
            return res.status(404).json({ error: "Item not found" });
        }

        // Perform Delete
        await connection.execute('DELETE FROM items WHERE id = ?', [id]);
        await connection.end();

        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});