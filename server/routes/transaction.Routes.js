import { Router } from 'express';
import { createTransaction, getTransaction, updateTransaction, deleteTransaction, getAllTransactions } from '../controllers/transaction.Controller.js';

const router = Router();

// Create a new transaction
router.post('/', createTransaction);

// Read a specific transaction by ID
router.get('/:id', getTransaction);

// Update a transaction's details by ID
router.put('/:id', updateTransaction);

// Delete a transaction by ID
router.delete('/:id', deleteTransaction);

// Get all transactions (optional for vendors or admins)
router.get('/', getAllTransactions);

export default router;

// -----------------------------------------------------------------------------------------------------------
/*

import { Router } from 'express';
import {
  createTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
} from '../controllers/transaction.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new transaction (Customers only)
router.post('/', authenticateAndAuthorize(['shopping'], 'customer'), createTransaction);

// Read a specific transaction by ID (Customers can access their own; vendors/admins have broader access)
router.get('/:id', authenticateAndAuthorize([], null, true), getTransaction);

// Update a transaction's details by ID (Vendors/admins have specific access)
router.put('/:id', authenticateAndAuthorize(['orderFulfillment'], null), updateTransaction);

// Delete a transaction by ID (Vendors/admins have specific access)
router.delete('/:id', authenticateAndAuthorize(['orderFulfillment'], null), deleteTransaction);

// Get all transactions (Vendors access related transactions; admins access all)
router.get('/', authenticateAndAuthorize(['reporting'], 'administrator'), getAllTransactions);

export default router;


*/
