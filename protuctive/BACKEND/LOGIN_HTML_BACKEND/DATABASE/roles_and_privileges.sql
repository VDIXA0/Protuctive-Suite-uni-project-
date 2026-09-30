-- =====================================================================
-- PHASE 2 -- DATABASE SECURITY EXTENSION
-- Run this AFTER schema.sql, as a MySQL admin (e.g. root), once.
-- =====================================================================
--
-- THE PROBLEM: right now the backend could connect to MySQL as 'root',
-- a user that can do ANYTHING -- SELECT, INSERT, DELETE, DROP TABLE, even
-- DROP DATABASE. That means one SQL injection bug, or one leaked .env
-- file, hands an attacker total control of the database.
--
-- THE FIX ("least privilege"): give each part of the app only the exact
-- permissions it needs, nothing more. Below we create TWO MySQL users
-- with different, narrow permission sets, and the login backend connects
-- as one or the other depending on whether the logged-in person is a
-- regular user or an admin (see config/database.js vs config/adminDatabase.js).

-- ---------------------------------------------------------------------
-- 1. shopnest_app -- the everyday user regular login/register requests use
-- ---------------------------------------------------------------------
-- Regular login/register only ever needs to read/write the users table
-- and add/check blacklist entries on logout -- never create/drop tables.
CREATE USER IF NOT EXISTS 'shopnest_app'@'localhost' IDENTIFIED BY 'ChangeThisAppPassword!';

GRANT SELECT, INSERT, UPDATE
  ON shopnest.users
  TO 'shopnest_app'@'localhost';

GRANT SELECT, INSERT, DELETE
  ON shopnest.token_blacklist
  TO 'shopnest_app'@'localhost';

-- Notice what's NOT granted: no DROP, no ALTER, no CREATE.

-- ---------------------------------------------------------------------
-- 2. shopnest_admin -- used ONLY for the admin-only route in the app
-- ---------------------------------------------------------------------
-- An admin managing accounts needs to see and delete any user, but still
-- has no reason to DROP tables or change the schema.
CREATE USER IF NOT EXISTS 'shopnest_admin'@'localhost' IDENTIFIED BY 'ChangeThisAdminPassword!';

GRANT SELECT, INSERT, UPDATE, DELETE
  ON shopnest.users
  TO 'shopnest_admin'@'localhost';

GRANT SELECT, DELETE
  ON shopnest.token_blacklist
  TO 'shopnest_admin'@'localhost';

-- ---------------------------------------------------------------------
-- REVOKE demo -- required by the assignment: show REVOKE actually being used
-- ---------------------------------------------------------------------
-- Suppose shopnest_app was mistakenly given DELETE on users when regular
-- users should never be able to delete accounts (only admins can, via
-- shopnest_admin). This shows correcting an over-broad permission:
REVOKE DELETE ON shopnest.users FROM 'shopnest_app'@'localhost';
-- shopnest_app can now only SELECT/INSERT/UPDATE on users -- it can no
-- longer delete a user row even if a bug in the code tried to.

FLUSH PRIVILEGES;

-- ---------------------------------------------------------------------
-- VERIFY: confirm each user's actual privileges (run manually to check)
-- ---------------------------------------------------------------------
-- SHOW GRANTS FOR 'shopnest_app'@'localhost';
-- SHOW GRANTS FOR 'shopnest_admin'@'localhost';

-- =====================================================================
-- SECURITY DEMO -- run these manually to SEE least privilege working
-- =====================================================================
--
-- Connect as the least-privilege user and try something it shouldn't be
-- able to do:
--
--   mysql -u shopnest_app -p shopnest
--   mysql> DELETE FROM users WHERE id = 1;
--   -> ERROR 1142 (42000): DELETE command denied to user 'shopnest_app'@'localhost'
--
-- Now connect as root (the old "does everything" user) and run it again:
--
--   mysql -u root -p shopnest
--   mysql> DELETE FROM users WHERE id = 1;
--   -> Query OK -- the row is gone.
--
-- THIS is the concrete security issue the assignment asks you to
-- demonstrate: if the app had connected as root the whole time, a single
-- SQL injection bug that let an attacker run arbitrary SQL could delete
-- or steal every account. Because the app connects as shopnest_app
-- instead, the same command fails at the database level even if the
-- application code had a bug that let it through.
