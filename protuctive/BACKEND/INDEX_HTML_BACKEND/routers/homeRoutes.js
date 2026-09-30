// Import the express library to create the router
const express = require('express');

// Import the controller functions that handle the logic for fetching home data
const { getHomeContent, getFeaturedProducts } = require('../controllers/homeController');

// Create an Express router instance to define modular routes
const router = express.Router();

// Define a GET route for the root path ('/'). 
// When someone visits this route, execute the 'getHomeContent' controller function.
router.get('/', getHomeContent);

// GET /api/home/featured-products - returns a few products to show on the home page
router.get('/featured-products', getFeaturedProducts);

// Export the router so it can be imported and used in your server.js file
module.exports = router;