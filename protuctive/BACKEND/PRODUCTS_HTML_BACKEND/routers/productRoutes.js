const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const requireAuth = require('../middleware/authMiddleware');

const router = express.Router();

// PUBLIC -- anyone can browse products, no login needed
router.get('/', getAllProducts);           // GET /api/products
router.get('/:id', getProductById);        // GET /api/products/5

// PROTECTED -- only a logged-in user (carrying a valid token) can modify the catalog
router.post('/', requireAuth, createProduct);       // POST /api/products
router.put('/:id', requireAuth, updateProduct);     // PUT /api/products/5
router.delete('/:id', requireAuth, deleteProduct);  // DELETE /api/products/5

module.exports = router;
