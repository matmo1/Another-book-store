CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insert some dummy data to test with
INSERT INTO items (name, price, description) VALUES 
('Laptop', 1200.00, 'High performance laptop'),
('Mouse', 25.50, 'Wireless mouse'),
('Keyboard', 45.00, 'Mechanical keyboard'),
('Monitor', 300.00, '4K Display'),
('Headphones', 80.00, 'Noise cancelling');