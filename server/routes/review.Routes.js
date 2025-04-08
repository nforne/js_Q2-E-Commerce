import { Router } from 'express';
import { createReview, getReview, updateReview, deleteReview, getAllReviews } from '../controllers/review.Controller.js';

const router = Router();

// Create a new review
router.post('/', createReview);

// Read a specific review by ID
router.get('/:id', getReview);

// Update a review's details by ID
router.put('/:id', updateReview);

// Delete a review by ID
router.delete('/:id', deleteReview);

// Get all reviews (optional for admins)
router.get('/', getAllReviews);

export default router;


// -----------------------------------------------------------------------------------------------------------
/*
import { Router } from 'express';
import {
  createReview,
  getReview,
  updateReview,
  deleteReview,
  getAllReviews,
} from '../controllers/review.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new review (Customers only for purchased products)
router.post('/', authenticateAndAuthorize(['shopping'], 'customer'), createReview);

// Read a specific review by ID (Customers can view their own; vendors/admins can access broader reviews)
router.get('/:id', authenticateAndAuthorize([], null, true), getReview);

// Update a review's details by ID (Customers can update their own; admins can update any review)
router.put('/:id', authenticateAndAuthorize([], null, true), updateReview);

// Delete a review by ID (Customers can delete their own; admins can delete any review)
router.delete('/:id', authenticateAndAuthorize([], null, true), deleteReview);

// Get all reviews (Admins access all; vendors can access reviews for their products)
router.get('/', authenticateAndAuthorize(['reporting'], 'administrator'), getAllReviews);

export default router;

*/