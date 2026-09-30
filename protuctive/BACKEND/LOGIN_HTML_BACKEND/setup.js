// setup.js — run this once with: node setup.js
// (run it from inside BACKEND/LOGIN_HTML_BACKEND)
//
// It asks for your MySQL root password, then does everything else:
//  - creates the "shopnest" database
//  - runs schema.sql and roles_and_privileges.sql
//  - writes the .env file for you
//
// After this finishes: npm install, then npm start.

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

async function main() {
  console.log("=== ShopNest login backend — one-time setup ===\n");

  let mysql;
  try {
    mysql = require("mysql2/promise");
  } catch (e) {
    console.error("Run `npm install` in this folder first, then re-run `node setup.js`.");
    process.exit(1);
  }

  const dbHost = (await ask("MySQL host [localhost]: ")) || "localhost";
  const dbUser = (await ask("MySQL admin username [root]: ")) || "root";
  const dbPassword = await ask("MySQL admin password (leave empty if none): ");
  rl.close();
  console.log("");

  let connection;
  try {
    connection = await mysql.createConnection({
      host: dbHost, user: dbUser, password: dbPassword, multipleStatements: true,
    });
  } catch (err) {
    console.error("\n❌ Could not connect to MySQL:", err.message);
    console.error("   Make sure MySQL Server is running and the login/password are correct, then re-run `node setup.js`.");
    process.exit(1);
  }

  console.log("✅ Connected to MySQL.");

  try {
    await connection.query("CREATE DATABASE IF NOT EXISTS shopnest;");
    await connection.query("USE shopnest;");
    console.log("✅ Database 'shopnest' ready.");

    const files = ["DATABASE/schema.sql", "DATABASE/roles_and_privileges.sql"];
    for (const file of files) {
      const sql = fs.readFileSync(path.join(__dirname, file), "utf8");
      try {
        await connection.query(sql);
        console.log(`✅ Ran ${file}`);
      } catch (err) {
        console.warn(`⚠️  ${file} had an issue: ${err.message}`);
      }
    }
  } finally {
    await connection.end();
  }

  const envContent =
    `DB_HOST=${dbHost}\n` +
    `DB_USER=shopnest_app\n` +
    `DB_PASSWORD=ChangeThisAppPassword!\n` +
    `ADMIN_DB_USER=shopnest_admin\n` +
    `ADMIN_DB_PASSWORD=ChangeThisAdminPassword!\n` +
    `DB_NAME=shopnest\n` +
    `JWT_SECRET=change_this_to_a_long_random_string\n` +
    `PORT=5001\n`;

  fs.writeFileSync(path.join(__dirname, ".env"), envContent);
  console.log("✅ Wrote .env");

  console.log("\n=== Setup complete! ===");
  console.log("Next, run:\n");
  console.log("  npm install");
  console.log("  npm start\n");
  console.log("Then open FRONTEND/login.html with Live Server and register an account.");
  console.log("To test the admin side, run this in MySQL after registering:");
  console.log("  UPDATE users SET role='admin' WHERE email='your@email.com';\n");
}

main().catch((err) => {
  console.error("\n❌ Something went wrong:", err.message);
  process.exit(1);
});
