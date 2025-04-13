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
  getReviewsByUser,
  getReviewsByVendor,
  getReviewsByProduct,
  getReviewsByUserVendor,
  getReviewsByUserProduct,
  getReviewsByIds,
} from '../controllers/review.Controller.js';
import { authenticateAndAuthorize } from '../middleware/authMiddleware.js';

const router = Router();

// Create a new review (Customers only)
router.post('/', authenticateAndAuthorize(['shopping'], 'customer'), createReview);

// Read a specific review by ID (Admins, the reviewer, or the vendor related to the review)
router.get('/:id', authenticateAndAuthorize([], null, true), getReview);

// Get all reviews (Admins and Vendors)
router.get('/', authenticateAndAuthorize(['reporting'], null), getAllReviews);

// Get reviews by user ID (Admins and users retrieving their own reviews)
router.get('/user/:user_id', authenticateAndAuthorize([], null, true), getReviewsByUser);

// Get reviews by vendor ID (Admins and vendors viewing reviews related to them)
router.get('/vendor/:vendor_id', authenticateAndAuthorize([], null, true), getReviewsByVendor);

// Get reviews by product ID (Admins and vendors viewing reviews related to products)
router.get('/product/:product_id', authenticateAndAuthorize([], null, true), getReviewsByProduct);

// Get reviews by user ID & vendor ID (Admins and users retrieving their own vendor-specific reviews)
router.get('/user/:user_id/vendor/:vendor_id', authenticateAndAuthorize([], null, true), getReviewsByUserVendor);

// Get reviews by user ID & product ID (Admins and users retrieving their own product-specific reviews)
router.get('/user/:user_id/product/:product_id', authenticateAndAuthorize([], null, true), getReviewsByUserProduct);

// Get multiple reviews by list of IDs (Any authenticated user)
router.post('/list', authenticateAndAuthorize([], null, true), getReviewsByIds);

// Update a review (Admins or the original reviewer)
router.put('/:id', authenticateAndAuthorize([], null, true), updateReview);

// Delete a review (Admins or the original reviewer)
router.delete('/:id', authenticateAndAuthorize([], null, true), deleteReview);

export default router;

*/