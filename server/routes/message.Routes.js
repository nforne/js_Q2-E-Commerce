import { Router } from 'express';
import { createMessage, getMessage, updateMessage, deleteMessage, getAllMessages } from '../controllers/message.Controller.js';

const router = Router();

// Create a new message
router.post('/', createMessage);

// Read a specific message by ID
router.get('/:id', getMessage);

// Update a message's details by ID
router.put('/:id', updateMessage);

// Delete a message by ID
router.delete('/:id', deleteMessage);

// Get all messages (optional)
router.get('/', getAllMessages);

export default router;


// -----------------------------------------------------------------------------------------------------------
/*
import { Router } from 'express';
import {
  createMessage,
  getMessage,
  updateMessage,
  deleteMessage,
  getMessagesByUser,
  getMessagesByTransaction,
} from '../controllers/message.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new message (Users involved in transactions only)
router.post('/', authenticateAndAuthorize(['transactionCommunication'], null), createMessage);

// Read a specific message by ID (Admins, sender, or receiver)
router.get('/:id', authenticateAndAuthorize([], null, true), getMessage);

// Get messages by user ID (Admins, sender, or receiver)
router.get('/user/:user_id', authenticateAndAuthorize([], null, true), getMessagesByUser);

// Get messages by transaction ID (Admins, sender, or receiver)
router.get('/transaction/:transaction_id', authenticateAndAuthorize([], null, true), getMessagesByTransaction);

// Update a message (Admins or sender only)
router.put('/:id', authenticateAndAuthorize([], null, true), updateMessage);

// Delete a message (Admins or sender only)
router.delete('/:id', authenticateAndAuthorize([], null, true), deleteMessage);

export default router;


*/