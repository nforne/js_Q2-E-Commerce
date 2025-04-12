import { firestore as _firestore } from '../firebase/firebaseConfig';
import ContentContext from './content.text.model.js';

class Review {
  constructor(
    review_id,
    user_id,
    vendor_id,
    product_id,
    rating,
    comment,
    review_date
  ) {
    this.review_id = review_id; // Primary Key: Unique identifier for the review
    this.user_id = user_id; // Foreign Key: Links to Users table
    this.vendor_id = vendor_id; // Foreign Key: Links to Users table (for vendor reviews)
    this.product_id = product_id; // Foreign Key: Links to Products table (for product reviews)
    this.rating = rating; // Integer: Rating value (1 to 5 stars)
    this.comment = new ContentContext(comment); // Text feedback with versioning
    this.review_date = review_date; // Date and time when the review was posted
  }

  // Static method to enforce constraints before creating or updating a review
  static async validateReview(user_id, vendor_id, product_id) {
    try {
      const firestore = _firestore();

      // Check for existing reviews by the user for the product or vendor
      const existingReviewQuery = firestore.collection('reviews')
        .where('user_id', '==', user_id)
        .where('product_id', '==', product_id)
        .get();

      const existingVendorReviewQuery = firestore.collection('reviews')
        .where('user_id', '==', user_id)
        .where('vendor_id', '==', vendor_id)
        .get();

      const [existingReviewSnapshot, existingVendorReviewSnapshot] = await Promise.all([existingReviewQuery, existingVendorReviewQuery]);

      if (!existingReviewSnapshot.empty || !existingVendorReviewSnapshot.empty) {
        throw new Error('User can only review a product or vendor once.');
      }

      // Check if the user has a completed transaction with the vendor or for the product
      const completedTransactionQuery = firestore.collection('transactions')
        .where('user_id', '==', user_id)
        .where('vendor_id', '==', vendor_id)
        .where('products', 'array-contains', { product_id: product_id }) // Matches the product in the transaction
        .where('status', '==', 'completed')
        .get();

      const completedTransactionSnapshot = await completedTransactionQuery;

      if (completedTransactionSnapshot.empty) {
        throw new Error('User cannot review unless they have conducted business with the vendor or purchased the product.');
      }

      return true; // Validation passed
    } catch (error) {
      throw error;
    }
  }
}

export default Review;
