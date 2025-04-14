import { Router } from 'express';
import {
  createMessage,
  getMessage,
  deleteMessage,
  getMessagesByUser,
  getMessagesByTransaction,
  getMessagesByIds,
  getAllMessages,
} from '../controllers/message.Controller.js';
import { authenticateAndAuthorize } from '../controllers/security/authMiddleware.js';

const router = Router();

// Create a new message (Users with transaction communication privileges)
router.post('/', authenticateAndAuthorize(['transactionCommunication'], null), createMessage);

// Get a specific message by ID (Admins or message participants)
router.get('/:id', authenticateAndAuthorize([], null, true), getMessage);

// Get all messages (Admins only)
router.get('/all', authenticateAndAuthorize(['messageManagement'], 'administrator'), getAllMessages);

// Get messages by user ID (Admins or message participants)
router.get('/user/:user_id', authenticateAndAuthorize([], null, true), getMessagesByUser);

// Get messages by transaction ID (Admins or transaction participants)
router.get('/transaction/:transaction_id', authenticateAndAuthorize([], null, true), getMessagesByTransaction);

// Get multiple messages by list of IDs (Any authenticated user)
router.post('/list', authenticateAndAuthorize([], null, true), getMessagesByIds);

// Delete a message (Admins or the sender)
router.delete('/:id', authenticateAndAuthorize([], null, true), deleteMessage);

export default router;



`import { Router } from 'express';
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

export default router;`


// -----------------------------------------------------------------------------------------------------------
/*



*/