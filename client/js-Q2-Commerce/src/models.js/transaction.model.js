import ContentContext from "./content.text.model.js";
import Stack from "./stack.model.js";

class Transaction {
  constructor(
    transaction_id,
    user_id,
    vendor_id,
    total_amount,
    payment_method_id,
    transaction_date,
    shipping_address_id,
    billing_address_id,
    products,
    tracking_status,
    messages
  ) {
    this.transaction_id = transaction_id; // Primary Key: Unique identifier
    this.user_id = user_id; // Foreign Key: Links to Users (buyer)
    this.vendor_id = vendor_id; // Foreign Key: Links to Users (vendor)
    this.total_amount = total_amount; // Total amount paid
    this.payment_method_id = payment_method_id; // References the payment method used
    this.transaction_date = transaction_date; // Date and time of purchase
    this.shipping_address_id = shipping_address_id; // References the shipping address
    this.billing_address_id = billing_address_id || shipping_address_id; // Defaults to shipping address if not provided
    this.products = products || []; // Array of shopping cart items
    this.tracking_status = new ContentContext(tracking_status) || new Stack(); // Stack of tracking status objects
    this.messages = messages || []; // Array of message objects associated with the transaction
  }

  // Method to add a product
  addProduct(product) {
    this.products.push(product);
    this.updateTotalAmount(); // Update the total amount
  }

  // Method to remove any product by ID
  removeProductById(product_id) {
    const initialLength = this.products.length;
    this.products = this.products.filter(
      (product) => product.product_id !== product_id
    );

    if (initialLength === this.products.length) {
      throw new Error(`Product with ID: ${product_id} not found.`);
    }

    this.updateTotalAmount(); // Update the total amount
  }

  // Method to add a tracking status
  addTrackingStatus(trackingObject) {
    this.tracking_status.push(trackingObject);
  }

  // Method to remove the last-added tracking status
  removeLastTrackingStatus() {
    if (this.tracking_status.size() > 0) {
      this.tracking_status.pop();
    } else {
      throw new Error("No tracking statuses to remove.");
    }
  }

  // Method to add a message to the messages array
  addMessage(message) {
    this.messages.push(message);
  }

  // Method to update the total amount
  updateTotalAmount() {
    this.total_amount = this.products.reduce((total, product) => {
      return total + product.unit_price * product.quantity;
    }, 0);
  }
}

export default Transaction;

// -----------------------------------------------------------------------------------------------------------
/*
import gDB from '../config/firebaseConfig.js';
import Transaction from '../models/transaction.model.js';

// Reference Firestore
const firestore = gDB.db;

// Create a new transaction (Customers only)
export async function createTransaction(req, res) {
  try {
    // Check if the user is authorized to create a transaction
    if (req.user.role !== 'customer' || !req.user.privileges.shopping?.isGranted) {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to create a transaction.' });
    }

    const transactionData = req.body;

    // Generate a unique transaction ID
    const transactionRef = firestore.collection('transactions').doc();
    const transactionId = transactionRef.id;

    // Initialize a new Transaction instance
    const transaction = new Transaction(
      transactionId,
      req.user.user_id, // Link to the buyer (customer)
      null, // Vendor will be null at creation, can be updated later
      transactionData.total_amount || 0,
      transactionData.payment_method_id,
      new Date(),
      transactionData.shipping_address_id,
      transactionData.billing_address_id,
      transactionData.products,
      [],
      []
    );

    // Save the transaction to Firestore
    await transactionRef.set({ ...transaction });

    res.status(201).send({ message: 'Transaction created successfully', transactionId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get a specific transaction by ID
export async function getTransaction(req, res) {
  try {
    const transactionId = req.params.id;
    const transactionDoc = await firestore.collection('transactions').doc(transactionId).get();

    if (!transactionDoc.exists) {
      return res.status(404).send({ message: 'Transaction not found.' });
    }

    const transactionData = transactionDoc.data();

    // Restrict access to the transaction based on roles
    if (req.user.role === 'customer' && transactionData.user_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only access your own transactions.' });
    } else if (req.user.role === 'vendor' && transactionData.vendor_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only access transactions related to your products.' });
    }

    res.status(200).send(transactionData);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a transaction's details by ID
export async function updateTransaction(req, res) {
  try {
    const transactionId = req.params.id;
    const updates = req.body;

    const transactionRef = firestore.collection('transactions').doc(transactionId);
    const transactionDoc = await transactionRef.get();

    if (!transactionDoc.exists) {
      return res.status(404).send({ message: 'Transaction not found.' });
    }

    const transactionData = transactionDoc.data();

    // Restrict updates based on roles
    if (req.user.role === 'vendor' && transactionData.vendor_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only update transactions related to your products.' });
    } else if (req.user.role !== 'administrator' && req.user.role !== 'vendor') {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to update transactions.' });
    }

    // Save the updated transaction
    await transactionRef.update(updates);

    res.status(200).send({ message: 'Transaction updated successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a transaction by ID
export async function deleteTransaction(req, res) {
  try {
    const transactionId = req.params.id;

    const transactionRef = firestore.collection('transactions').doc(transactionId);
    const transactionDoc = await transactionRef.get();

    if (!transactionDoc.exists) {
      return res.status(404).send({ message: 'Transaction not found.' });
    }

    const transactionData = transactionDoc.data();

    // Restrict deletion based on roles
    if (req.user.role === 'vendor' && transactionData.vendor_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only delete transactions related to your products.' });
    } else if (req.user.role !== 'administrator' && req.user.role !== 'vendor') {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to delete transactions.' });
    }

    // Delete the transaction
    await transactionRef.delete();

    res.status(200).send({ message: 'Transaction deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get all transactions
export async function getAllTransactions(req, res) {
  try {
    const transactionSnapshot = await firestore.collection('transactions').get();

    if (transactionSnapshot.empty) {
      return res.status(404).send({ message: 'No transactions found.' });
    }

    const transactions = [];
    transactionSnapshot.forEach(doc => {
      transactions.push(doc.data());
    });

    // Restrict access to transactions based on roles
    if (req.user.role === 'vendor') {
      const vendorTransactions = transactions.filter(
        transaction => transaction.vendor_id === req.user.user_id
      );
      return res.status(200).send(vendorTransactions);
    } else if (req.user.role !== 'administrator') {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to view all transactions.' });
    }

    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

*/

