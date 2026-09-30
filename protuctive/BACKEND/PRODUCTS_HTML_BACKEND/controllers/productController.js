const ProductModel = require('../models/productModel');

// ===================== GET ALL PRODUCTS =====================
// Handles: GET /api/products
// Also handles: GET /api/products?search=headphones&category=electronics
const getAllProducts = async (req, res) => {
  try {
    // req.query holds anything after the "?" in the URL, e.g. ?search=...&category=...
    const { search, category } = req.query;
    const products = await ProductModel.getAll({ search, category });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// ===================== GET ONE PRODUCT =====================
// Handles: GET /api/products/:id  (used by the Product Details page)
const getProductById = async (req, res) => {
  try {
    const { id } = req.params; // whatever was in the URL where ":id" is

    const product = await ProductModel.getById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `No product found with id ${id}`
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// ===================== CREATE PRODUCT =====================
// Handles: POST /api/products  (protected -- requires login, see productRoutes.js)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    // Basic validation -- name and price are the only truly required fields
    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product name and price are required'
      });
    }

    if (isNaN(price) || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    const newProduct = await ProductModel.create({ name, description, price, image, category });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// ===================== UPDATE PRODUCT =====================
// Handles: PUT /api/products/:id  (protected)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, category } = req.body;

    const existing = await ProductModel.getById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `No product found with id ${id}`
      });
    }

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product name and price are required'
      });
    }

    const updated = await ProductModel.update(id, { name, description, price, image, category });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// ===================== DELETE PRODUCT =====================
// Handles: DELETE /api/products/:id  (protected)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await ProductModel.remove(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `No product found with id ${id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
