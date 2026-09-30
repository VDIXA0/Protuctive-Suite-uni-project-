CREATE TABLE IF NOT EXISTS home_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  missionText TEXT,
  startedText TEXT,
  valuesText TEXT
);

INSERT INTO home_content (title, subtitle, missionText, startedText, valuesText) 
VALUES (
  'Welcome to ShopNest', 
  'Quality goods, curated with passion since 2024.', 
  'Founded in late 2024 ', 
  'What began as a localized script...', 
  'We believe that simplicity beats complexity.'
);

-- NOTE: the "products" table used to live here too, but now that a dedicated
-- PRODUCTS_HTML_BACKEND exists, that backend owns the products table (see
-- BACKEND/PRODUCTS_HTML_BACKEND/database/schema.sql). Only run that one schema
-- for products, so you don't end up with duplicate sample rows.