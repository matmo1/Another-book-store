CREATE TABLE IF NOT EXISTS authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
    genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL
);

-- Seed some initial data
INSERT INTO authors (name) VALUES ('J.K. Rowling'), ('George Orwell');
INSERT INTO genres (name) VALUES ('Fantasy'), ('Dystopian');
INSERT INTO books (title, price, author_id, genre_id) VALUES 
('Harry Potter', 19.99, 1, 1),
('1984', 14.50, 2, 2);