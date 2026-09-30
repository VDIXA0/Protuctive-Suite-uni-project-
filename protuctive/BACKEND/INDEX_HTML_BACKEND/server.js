// express is a tool used to create the backend server and the api
const express = require("express");
// cors allows the frontend to communicate with the backend
const cors = require("cors");

// imported the environment variables used to hide sensitive information like database_password
require("dotenv").config();
const app = express(); // creating express for the application

// middleware Allows the backend to read JSON data sent from frontend
app.use(express.json());
// Enable frontend & backend communication
app.use(cors());

const homeRoutes = require("./routers/homeRoutes"); // FIXED: folder is "routers", not "routes"
// connect API routers
app.use("/api/home", homeRoutes);

// check the route if the backend is running 
app.get("/", (req, res) => {
  res.send("index html backend running");
});

// PORT of the server 
const PORT = 5000;

// the start of the server
app.listen(PORT, () => {
  console.log(`index backend running on port ${PORT}`);
});
