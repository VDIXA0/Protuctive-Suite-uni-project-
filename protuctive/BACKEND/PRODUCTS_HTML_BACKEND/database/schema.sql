-- Products table, matching the columns from the project requirements:
-- id, name, description, price, image
-- (category and is_featured added since products.html needs them for filtering/search)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data so you have something to actually see on products.html right away.
-- Matches the mockProducts you already had in main.js, so the frontend switch feels seamless.
INSERT INTO products (name, description, price, image, category, is_featured) VALUES
('Wireless Headphones', 'High-quality wireless noise-canceling headphones.', 99.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 'electronics', TRUE),
('Classic Denim Jacket', 'Comfortable and stylish denim jacket for all seasons.', 59.99, 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500', 'clothing', TRUE),
('Smart Fitness Watch', 'Track your health, workouts, and daily notifications.', 129.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 'electronics', TRUE),
('Casual Cotton T-Shirt', 'Soft 100% organic cotton everyday t-shirt.', 19.99, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', 'clothing', TRUE);
