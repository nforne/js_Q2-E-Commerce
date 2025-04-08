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
  getAllMessages,
} from '../controllers/message.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new message (Customers and vendors related to a transaction)
router.post('/', authenticateAndAuthorize(['transactionCommunication'], null), createMessage);

// Read a specific message by ID (Customers and vendors can access their own threads; admins can access all)
router.get('/:id', authenticateAndAuthorize([], null, true), getMessage);

// Update a message's details by ID (Users can update their own messages; admins can update any message)
router.put('/:id', authenticateAndAuthorize([], null, true), updateMessage);

// Delete a message by ID (Users can delete their own messages; admins can delete any message)
router.delete('/:id', authenticateAndAuthorize([], null, true), deleteMessage);

// Get all messages (Admins can access all; users can filter by transactions they are part of)
router.get('/', authenticateAndAuthorize(['reporting'], 'administrator'), getAllMessages);

export default router;

*/