//import database connection
const db = require('../config/database');
// Home Model to fetch content from MySQL
const HomeModel = { // FIXED: was "Homemodel" (lowercase m), didn't match module.exports below
    getHomeContent: (callback) => {
        const query = "SELECT * FROM home_content LIMIT 1";
        db.query(query, callback); // FIXED: was "query.callback" (dot instead of comma) - callback was never passed to mysql
    },
    // Returns a handful of products marked as featured, for the home page to display
    getFeaturedProducts: (callback) => {
        const query = "SELECT * FROM products WHERE is_featured = TRUE LIMIT 4";
        db.query(query, callback);
    }
};
module.exports = HomeModel;
