import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser, getAllUsers } from '../controllers/user.Controller.js';

const router = Router();

// CRUD endpoints

// Create a new user
router.post('/', createUser);

// Read a specific user by ID
router.get('/:id', getUser);

// Update a user's details by ID
router.put('/:id', updateUser);

// Delete a user by ID
router.delete('/:id', deleteUser);

// Get all users (optional for admin features)
router.get('/', getAllUsers);


export default router;

// -----------------------------------------------------------------------------------------------------------

/*

import { Router } from 'express';
import { createUser, getUser, updateUser, deleteUser, getAllUsers } from '../controllers/user.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new user (Open route, no authentication required)
router.post('/', createUser);

// Read a specific user by ID (Customers and vendors manage their own accounts; admins access any account)
router.get('/:id', authenticateAndAuthorize([], null, true), getUser);

// Update a user's details by ID (Customers and vendors manage their own accounts; admins access any account)
router.put('/:id', authenticateAndAuthorize(['selfManagement'], null, true), updateUser);

// Delete a user by ID (Admin privileges required)
router.delete('/:id', authenticateAndAuthorize(['userManagement'], 'administrator'), deleteUser);

// Get all users (Admin reporting privileges required)
router.get('/', authenticateAndAuthorize(['reporting'], 'administrator'), getAllUsers);

export default router;


// test code postman
{
  "email": "admin@example.com",
  "password": "admin_password"
}

{
  "email": "user@example.com",
  "password": "password123"
}


*/

