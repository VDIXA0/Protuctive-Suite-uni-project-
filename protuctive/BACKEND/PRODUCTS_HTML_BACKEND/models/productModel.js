// The "model" is the ONLY layer allowed to talk directly to the products table.
const db = require('../config/database');

const ProductModel = {

  // Get all products, with OPTIONAL search + category filters.
  // Both filters are optional so the same function works for "get everything"
  // and "get filtered results" -- the controller decides what to pass in.
  getAll: async ({ search, category } = {}) => {
    let query = 'SELECT * FROM products WHERE 1=1';
    // "WHERE 1=1" is a common trick: it's always true, so we can safely
    // keep appending "AND ..." conditions below without worrying about
    // whether this is the "first" condition or not.
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      // "%value%" means "contains this text anywhere" in SQL's LIKE syntax
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  // Get a single product by its id (used for the Product Details page)
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Create a new product
  create: async ({ name, description, price, image, category }) => {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, image, category]
    );
    return { id: result.insertId, name, description, price, image, category };
  },

  // Update an existing product by id
  update: async (id, { name, description, price, image, category }) => {
    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, image = ?, category = ? WHERE id = ?',
      [name, description, price, image, category, id]
    );
    return { id, name, description, price, image, category };
  },

  // Delete a product by id
  remove: async (id) => {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    // affectedRows tells us whether a row was actually deleted (0 means the id didn't exist)
    return result.affectedRows > 0;
  }
};

module.exports = ProductModel;
