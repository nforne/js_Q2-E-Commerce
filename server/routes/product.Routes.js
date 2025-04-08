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
} from '../controllers/product.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new product (Vendors only)
router.post('/', authenticateAndAuthorize(['productManagement'], 'vendor'), createProduct);

// Read a specific product by ID (Open to all users including customers)
router.get('/:id', authenticateAndAuthorize([], null), getProduct);

// Update a product's details by ID (Vendors can update their own products; admins can update any product)
router.put('/:id', authenticateAndAuthorize(['productManagement'], null), updateProduct);

// Delete a product by ID (Vendors can delete their own products; admins can delete any product)
router.delete('/:id', authenticateAndAuthorize(['productManagement'], null), deleteProduct);

// Get all products (Admins have unrestricted access; vendors see their own products)
router.get('/', authenticateAndAuthorize(['reporting'], 'administrator'), getAllProducts);

export default router;

*/
