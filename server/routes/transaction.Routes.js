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
  getTransactionsByIds,
} from '../controllers/transaction.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new transaction (Authenticated customers)
router.post('/', authenticateAndAuthorize(['shopping'], 'customer'), createTransaction);

// Read a specific transaction by ID (Admins or transaction participants)
router.get('/:id', authenticateAndAuthorize([], null, true), getTransaction);

// Get all transactions (Admins)
router.get('/', authenticateAndAuthorize(['transactionManagement'], 'administrator'), getAllTransactions);

// Get transactions by user ID (Admins or users retrieving their own transactions)
router.get('/user/:user_id', authenticateAndAuthorize([], null, true), getTransactionsByUser);

// Get multiple transactions by list of IDs (Any authenticated user)
router.post('/list', authenticateAndAuthorize([], null, true), getTransactionsByIds);

// Update a transaction (Admins or the original user)
router.put('/:id', authenticateAndAuthorize([], null, true), updateTransaction);

// Delete a transaction (Admins or the original user)
router.delete('/:id', authenticateAndAuthorize([], null, true), deleteTransaction);

export default router;



*/
