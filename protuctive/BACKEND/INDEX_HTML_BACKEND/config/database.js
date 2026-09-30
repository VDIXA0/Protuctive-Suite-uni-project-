//create a connection between node.js and mysql
require("dotenv").config();
const mysql = require("mysql2"); // FIXED: "mysql12" is not a real package

const db = mysql.createConnection({ // FIXED: was mysql.connectConnectiom (typo, doesn't exist)
  host: process.env.DB_HOST || "localhost", // FIXED: "Localhost" -> "localhost"
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // FIXED: no more hardcoded password
  database: process.env.DB_NAME || "shopnest"
});

//check the connection
db.connect((error) => {
  if (error) {
    console.log("Database connection failed:", error.message); // FIXED: typo "Databasecoonection faild"
  } else {
    console.log("database connected");
  }
});

//export connection
module.exports = db;
