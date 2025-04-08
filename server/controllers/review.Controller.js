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

// Reference Firestore
const firestore = gDB.db;

// Joi schema for reviews
const reviewSchema = Joi.object({
  vendor_id: Joi.string().required(), // Vendor being reviewed
  product_id: Joi.string().required(), // Product being reviewed
  rating: Joi.number().integer().min(1).max(5).required(), // Rating: 1 to 5 stars
  comment: Joi.string().max(500).required(), // Comment with a max length of 500 characters
});

// Create a new review
export async function createReview(req, res) {
  try {
    // Validate privileges
    if (req.user.role !== 'customer' || !req.user.privileges.shopping?.isGranted) {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to create a review.' });
    }

    // Validate user input
    const { error } = reviewSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { vendor_id, product_id, rating, comment } = req.body;

    // Validate review constraints
    await Review.validateReview(req.user.user_id, vendor_id, product_id);

    // Generate a unique review ID
    const reviewRef = firestore.collection('reviews').doc();
    const reviewId = reviewRef.id;

    // Initialize a new Review instance
    const review = new Review(
      reviewId,
      req.user.user_id,
      vendor_id,
      product_id,
      rating,
      comment,
      new Date()
    );

    // Save the review to Firestore
    await reviewRef.set({ ...review });

    res.status(201).send({ message: 'Review created successfully.', reviewId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get a specific review
export async function getReview(req, res) {
  try {
    const reviewId = req.params.id;
    const reviewDoc = await firestore.collection('reviews').doc(reviewId).get();

    if (!reviewDoc.exists) {
      return res.status(404).send({ message: 'Review not found.' });
    }

    const reviewData = reviewDoc.data();

    if (req.user.role === 'customer' && reviewData.user_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only access your own reviews.' });
    } else if (req.user.role === 'vendor' && reviewData.vendor_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only access reviews related to your products.' });
    }

    res.status(200).send(reviewData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a review
export async function updateReview(req, res) {
  try {
    const reviewId = req.params.id;
    const updates = req.body;

    // Make fields optional for updates
    const updateSchema = reviewSchema.fork(Object.keys(reviewSchema.describe().keys), (field) =>
      field.optional()
    );

    const { error } = updateSchema.validate(updates);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const reviewRef = firestore.collection('reviews').doc(reviewId);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return res.status(404).send({ message: 'Review not found.' });
    }

    const reviewData = reviewDoc.data();

    if (req.user.role === 'customer' && reviewData.user_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only update your own reviews.' });
    } else if (req.user.role !== 'administrator' && req.user.role !== 'customer') {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to update reviews.' });
    }

    await reviewRef.update(updates);

    res.status(200).send({ message: 'Review updated successfully.' });
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

    const reviewData = reviewDoc.data();

    if (req.user.role === 'customer' && reviewData.user_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only delete your own reviews.' });
    } else if (req.user.role !== 'administrator' && req.user.role !== 'customer') {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to delete reviews.' });
    }

    await reviewRef.delete();

    res.status(200).send({ message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get all reviews
export async function getAllReviews(req, res) {
  try {
    const reviewSnapshot = await firestore.collection('reviews').get();

    if (reviewSnapshot.empty) {
      return res.status(404).send({ message: 'No reviews found.' });
    }

    const reviews = [];
    reviewSnapshot.forEach((doc) => {
      reviews.push(doc.data());
    });

    if (req.user.role === 'vendor') {
      const vendorReviews = reviews.filter((review) => review.vendor_id === req.user.user_id);
      return res.status(200).send(vendorReviews);
    } else if (req.user.role !== 'administrator') {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to view all reviews.' });
    }

    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}



*/