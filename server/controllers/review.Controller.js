import gDB from '../config/firebaseConfig.js';

// Reference Firestore
const firestore = gDB.db;

// Create a new review
export async function createReview(req, res) {
  try {
    const reviewData = req.body;

    // Generate a unique review ID (Firestore document ID)
    const reviewRef = firestore.collection('reviews').doc();
    const reviewId = reviewRef.id;

    // Add review_id to the review object
    const completeReviewData = { ...reviewData, review_id: reviewId };

    // Save the review in Firestore
    await reviewRef.set(completeReviewData);

    res.status(201).send({ message: 'Review created successfully', reviewId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get a specific review by ID
export async function getReview(req, res) {
  try {
    const reviewId = req.params.id;
    const reviewDoc = await firestore.collection('reviews').doc(reviewId).get();

    if (!reviewDoc.exists) {
      return res.status(404).send({ message: 'Review not found' });
    }

    res.status(200).send(reviewDoc.data());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a review's details by ID
export async function updateReview(req, res) {
  try {
    const reviewId = req.params.id;
    const updates = req.body;

    // Check if review exists
    const reviewRef = firestore.collection('reviews').doc(reviewId);
    const reviewDoc = await reviewRef.get();
    if (!reviewDoc.exists) {
      return res.status(404).send({ message: 'Review not found' });
    }

    // Update the review in Firestore
    await reviewRef.update(updates);

    res.status(200).send({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a review by ID
export async function deleteReview(req, res) {
  try {
    const reviewId = req.params.id;

    // Check if review exists
    const reviewRef = firestore.collection('reviews').doc(reviewId);
    const reviewDoc = await reviewRef.get();
    if (!reviewDoc.exists) {
      return res.status(404).send({ message: 'Review not found' });
    }

    // Delete the review in Firestore
    await reviewRef.delete();

    res.status(200).send({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get all reviews
export async function getAllReviews(req, res) {
  try {
    const reviewSnapshot = await firestore.collection('reviews').get();

    if (reviewSnapshot.empty) {
      return res.status(404).send({ message: 'No reviews found' });
    }

    const reviews = [];
    reviewSnapshot.forEach(doc => {
      reviews.push(doc.data());
    });

    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}


// -----------------------------------------------------------------------------------------------------------
/*
import gDB from '../config/firebaseConfig.js';
import Joi from 'joi';
import Review from '../models/review.model.js';
import { logEvent } from '../services/logging.js';

// Reference Firestore
const firestore = gDB.db;

// Joi schema for reviews
const reviewSchema = Joi.object({
  vendor_id: Joi.string().required(),
  product_id: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).required(),
});

// Create a new review
export async function createReview(req, res) {
  try {
    if (req.user.role !== 'customer' || !req.user.privileges.shopping?.isGranted) {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to create a review.' });
    }

    const { error } = reviewSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { vendor_id, product_id, rating, comment } = req.body;

    await Review.validateReview(req.user.user_id, vendor_id, product_id);

    const reviewRef = firestore.collection('reviews').doc();
    const reviewId = reviewRef.id;

    const review = new Review(
      reviewId,
      req.user.user_id,
      vendor_id,
      product_id,
      rating,
      comment,
      new Date()
    );

    await reviewRef.set({ ...review });

    // Log review creation
    await logEvent('Review Created', req.user.user_id, { reviewId, vendor_id, product_id, rating, comment });

    res.status(201).send({ message: 'Review created successfully.', reviewId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get reviews by user ID
export async function getReviewsByUser(req, res) {
  try {
    const userId = req.params.user_id;

    const reviewSnapshot = await firestore.collection('reviews').where('user_id', '==', userId).get();
    if (reviewSnapshot.empty) {
      return res.status(404).send({ message: 'No reviews found for this user.' });
    }

    const reviews = [];
    reviewSnapshot.forEach(doc => reviews.push(doc.data()));

    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get reviews by vendor ID
export async function getReviewsByVendor(req, res) {
  try {
    const vendorId = req.params.vendor_id;

    const reviewSnapshot = await firestore.collection('reviews').where('vendor_id', '==', vendorId).get();
    if (reviewSnapshot.empty) {
      return res.status(404).send({ message: 'No reviews found for this vendor.' });
    }

    const reviews = [];
    reviewSnapshot.forEach(doc => reviews.push(doc.data()));

    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get reviews by product ID
export async function getReviewsByProduct(req, res) {
  try {
    const productId = req.params.product_id;

    const reviewSnapshot = await firestore.collection('reviews').where('product_id', '==', productId).get();
    if (reviewSnapshot.empty) {
      return res.status(404).send({ message: 'No reviews found for this product.' });
    }

    const reviews = [];
    reviewSnapshot.forEach(doc => reviews.push(doc.data()));

    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get reviews by user ID & vendor ID
export async function getReviewsByUserVendor(req, res) {
  try {
    const { user_id, vendor_id } = req.params;

    const reviewSnapshot = await firestore.collection('reviews')
      .where('user_id', '==', user_id)
      .where('vendor_id', '==', vendor_id)
      .get();

    if (reviewSnapshot.empty) {
      return res.status(404).send({ message: 'No reviews found from this user for this vendor.' });
    }

    const reviews = [];
    reviewSnapshot.forEach(doc => reviews.push(doc.data()));

    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get reviews by user ID & product ID
export async function getReviewsByUserProduct(req, res) {
  try {
    const { user_id, product_id } = req.params;

    const reviewSnapshot = await firestore.collection('reviews')
      .where('user_id', '==', user_id)
      .where('product_id', '==', product_id)
      .get();

    if (reviewSnapshot.empty) {
      return res.status(404).send({ message: 'No reviews found from this user for this product.' });
    }

    const reviews = [];
    reviewSnapshot.forEach(doc => reviews.push(doc.data()));

    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a review
export async function deleteReview(req, res) {
  try {
    const reviewId = req.params.id;

    const reviewRef = firestore.collection('reviews').doc(reviewId);
    const reviewDoc = await reviewRef.get();
    if (!reviewDoc.exists) {
      return res.status(404).send({ message: 'Review not found.' });
    }

    await reviewRef.delete();

    // Log review deletion
    await logEvent('Review Deleted', req.user.user_id, { reviewId });

    res.status(200).send({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}



*/