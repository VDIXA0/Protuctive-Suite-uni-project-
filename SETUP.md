# Running this project (simple version)

Everything you need for grading lives in one folder:
`BACKEND/LOGIN_HTML_BACKEND`. The frontend pages that talk to it are
`FRONTEND/login.html` and `FRONTEND/dashboard.html`.

You need **Node.js** and **MySQL Server** installed and MySQL running.

## Setup (do this once)

Open a terminal inside `BACKEND/LOGIN_HTML_BACKEND` and run:

```bash
npm install
node setup.js
```

`setup.js` asks for your MySQL root username/password, then automatically:
- creates the `shopnest` database
- creates the tables (`users`, `token_blacklist`)
- creates two least-privilege MySQL users (`shopnest_app`, `shopnest_admin`)
  with different GRANT/REVOKE permissions
- writes the `.env` file for you

## Run it

```bash
npm start
```

Leave that terminal open. You'll see:
```
auth backend running on port 5001
Database connected
```

Then open `FRONTEND/login.html` with VS Code's Live Server extension
(right-click the file → "Open with Live Server"). Don't open it by
double-clicking — API calls need a real local server.

## Trying it out (this is your whole demo)

1. Register a new account on the page — you land on `dashboard.html`,
   showing your name, email, and role (`user`).
2. Click **"Try admin-only endpoint"** → you get a 403 "Admin access
   only" alert. That's authorization working correctly.
3. To become an admin, run this in MySQL once (Workbench or CLI):
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```
4. Log out, log back in (a fresh token is needed to pick up the new
   role), go to the dashboard, click the same button again → this time
   you get the full user list. This is the "different users, different
   access" requirement, enforced by the backend, not just hidden in the UI.
5. Click **Logout**, then try refreshing/reusing the old session — you're
   sent back to the login page. The token was blacklisted server-side.

## What satisfies what (for your report/demo)

| Requirement | Where |
|---|---|
| Login / Registration pages | `FRONTEND/login.html` |
| Secure DB connection | `config/database.js`, `config/adminDatabase.js` |
| Password hashing | `controllers/authController.js` (bcrypt) |
| Authentication | JWT issued on login/register, checked in `middleware/authMiddleware.js` |
| Authorization | `middleware/requireAdmin.js` + `/api/auth/admin/users` route |
| Input validation | required-field checks in `authController.js` |
| Sessions | the JWT itself (7-day expiry) is the session |
| Logout | `POST /api/auth/logout` + `token_blacklist` table |
| DB users w/ different privileges, least privilege | `DATABASE/roles_and_privileges.sql` |
| GRANT and REVOKE | same file — grants `shopnest_app`/`shopnest_admin`, then a REVOKE demo |
| Roles connected to the login system | `config/database.js` (app) vs `config/adminDatabase.js` (admin) — which one runs depends on the logged-in user's role |
| Different users, different access | steps 2 and 4 above |
| Security issue demo | comment block at the bottom of `roles_and_privileges.sql` — shows the exact commands to run to prove least privilege blocks a query that `root` would allow |

## Note

The `INDEX_HTML_BACKEND` and `PRODUCTS_HTML_BACKEND` folders (and the shop
pages) aren't required by the assignment — they're the extra "store" you
built around the login system. You can ignore them for grading, or mention
them briefly as "the app the login system protects" if you want.
