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
  getAllProducts,
  getProductsByUser,
  getProductsByCategory,
  getProductsByBusiness,
  getProductsByIds,
} from '../controllers/product.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new product (Vendors only)
router.post('/', authenticateAndAuthorize(['inventoryManagement'], 'vendor'), createProduct);

// Read a specific product by ID (Admins or Vendors)
router.get('/:id', authenticateAndAuthorize([], null, true), getProduct);

// Get all products (Admins and Vendors)
router.get('/', authenticateAndAuthorize(['reporting'], null), getAllProducts);

// Get products by user ID (Admins and vendors retrieving their own products)
router.get('/user/:user_id', authenticateAndAuthorize([], null, true), getProductsByUser);

// Get products by category ID (Admins and vendors filtering products)
router.get('/category/:category_id', authenticateAndAuthorize([], null, true), getProductsByCategory);

// Get products by business ID (Admins and vendors viewing products by business)
router.get('/business/:business_id', authenticateAndAuthorize([], null, true), getProductsByBusiness);

// Get multiple products by list of IDs (Any authenticated user)
router.post('/list', authenticateAndAuthorize([], null, true), getProductsByIds);

// Update a product (Admins or the original vendor)
router.put('/:id', authenticateAndAuthorize([], null, true), updateProduct);

// Delete a product (Admins or the original vendor)
router.delete('/:id', authenticateAndAuthorize([], null, true), deleteProduct);

export default router;



*/
