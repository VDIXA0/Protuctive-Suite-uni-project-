-- This creates a table called "users" in your database, if it doesn't already exist
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,   -- unique ID for each user, auto-increases (1, 2, 3...)
  name VARCHAR(255) NOT NULL,          -- user's full name, required, max 255 characters
  email VARCHAR(255) NOT NULL UNIQUE,  -- email must be unique -- no two users can share one
  password VARCHAR(255) NOT NULL,      -- this will store the HASHED password, not the real one
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user', -- drives authorization (Phase 1) and which DB user is used (Phase 2)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- auto-fills with the date/time the row was created
);

-- Needed for logout to actually work: a JWT can't be "deleted" once issued,
-- it's just signed data the client holds. So logout records the token here,
-- and the login middleware rejects any token found in this table.
CREATE TABLE IF NOT EXISTS token_blacklist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- To test the admin side of things after you register a normal account,
-- run this once (with your own email) to promote yourself to admin:
--   UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
