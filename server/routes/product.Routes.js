import { Router } from 'express';
import { createProduct, getProduct, updateProduct, deleteProduct, getAllProducts } from '../controllers/product.Controller.js';

const router = Router();

// Create a new product
router.post('/', createProduct);

// Read a specific product by ID
router.get('/:id', getProduct);

// Update a product's details by ID
router.put('/:id', updateProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);

// Get all products (optional)
router.get('/', getAllProducts);

export default router;


// -----------------------------------------------------------------------------------------------------------
/*
import { Router } from 'express';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getProductsByUser,
  getProductsByCategory,
  getProductsByBusiness,
} from '../controllers/product.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new product (Vendors and Admins)
router.post('/', authenticateAndAuthorize(['productManagement'], null), createProduct);

// Read a specific product by ID (Anyone)
router.get('/:id', getProduct);

// Get products by vendor ID (User ID)
router.get('/user/:user_id', getProductsByUser);

// Get products by category ID (Anyone)
router.get('/category/:category_id', getProductsByCategory);

// Get products by business ID (Anyone)
router.get('/business/:business_id', getProductsByBusiness);

// Update a product (Admins can update any product; Vendors can update their own)
router.put('/:id', authenticateAndAuthorize([], null, true), updateProduct);

// Delete a product (Admins can delete any product; Vendors can delete their own)
router.delete('/:id', authenticateAndAuthorize([], null, true), deleteProduct);

export default router;


*/
