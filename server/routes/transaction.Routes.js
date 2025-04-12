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
  getTransactionsByUser,
} from '../controllers/transaction.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new transaction (Customers only)
router.post('/', authenticateAndAuthorize(['transactionCreation'], 'customer'), createTransaction);

// Read a specific transaction by ID (Customers and Vendors linked to transaction)
router.get('/:id', authenticateAndAuthorize([], null, true), getTransaction);

// Update a transaction's details by ID (Admins and Customers involved in transaction)
router.put('/:id', authenticateAndAuthorize([], null, true), updateTransaction);

// Delete a transaction by ID (Admins and Customers involved in transaction)
router.delete('/:id', authenticateAndAuthorize([], null, true), deleteTransaction);

// Get all transactions (Admins only)
router.get('/', authenticateAndAuthorize(['reporting'], 'administrator'), getAllTransactions);

// Get transactions by user ID (Customers only for their transactions)
router.get('/user/:user_id', authenticateAndAuthorize([], null, true), getTransactionsByUser);

export default router;



*/
