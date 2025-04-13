import gDB from '../config/firebaseConfig.js';

// Reference Firestore
const firestore = gDB.db;

// Create a new transaction
export async function createTransaction(req, res) {
  try {
    const transactionData = req.body;

    // Generate a unique transaction ID (use Firestore document ID)
    const transactionRef = firestore.collection('transactions').doc();
    const transactionId = transactionRef.id;

    // Add transaction_id to the transaction object
    const completeTransactionData = { ...transactionData, transaction_id: transactionId };

    // Store the transaction in Firestore with the transaction ID as the key
    await transactionRef.set(completeTransactionData);

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
      return res.status(404).send({ message: 'Transaction not found' });
    }

    res.status(200).send(transactionDoc.data());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a transaction's details by ID
export async function updateTransaction(req, res) {
  try {
    const transactionId = req.params.id;
    const updates = req.body;

    // Check if transaction exists
    const transactionRef = firestore.collection('transactions').doc(transactionId);
    const transactionDoc = await transactionRef.get();
    if (!transactionDoc.exists) {
      return res.status(404).send({ message: 'Transaction not found' });
    }

    // Update the transaction in Firestore
    await transactionRef.update(updates);

    res.status(200).send({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a transaction by ID
export async function deleteTransaction(req, res) {
  try {
    const transactionId = req.params.id;

    // Check if transaction exists
    const transactionRef = firestore.collection('transactions').doc(transactionId);
    const transactionDoc = await transactionRef.get();
    if (!transactionDoc.exists) {
      return res.status(404).send({ message: 'Transaction not found' });
    }

    // Delete the transaction in Firestore
    await transactionRef.delete();

    res.status(200).send({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get all transactions
export async function getAllTransactions(req, res) {
  try {
    const transactionSnapshot = await firestore.collection('transactions').get();

    if (transactionSnapshot.empty) {
      return res.status(404).send({ message: 'No transactions found' });
    }

    const transactions = [];
    transactionSnapshot.forEach(doc => {
      transactions.push(doc.data());
    });

    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// -----------------------------------------------------------------------------------------------------------
/*
import gDB from '../config/firebaseConfig.js';
import Joi from 'joi';
import { logEvent } from '../services/logging.js';

// Reference Firestore
const firestore = gDB.db;

// Joi schema for transactions
const transactionSchema = Joi.object({
  user_id: Joi.string().required(), // Customer's ID
  vendor_id: Joi.string().allow(null), // Vendor's ID (nullable at creation)
  total_amount: Joi.number().positive().required(), // Must be a positive number
  payment_method_id: Joi.string().required(), // Payment method ID
  shipping_address_id: Joi.string().required(), // Shipping address ID
  billing_address_id: Joi.string().required(), // Billing address ID
  products: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.string().required(),
        quantity: Joi.number().positive().required(),
      })
    )
    .min(1) // At least one product is required
    .required(),
  notes: Joi.string().max(500).optional(), // Optional field
});

// Joi schema for transaction ID list validation
const transactionIdListSchema = Joi.object({
  transaction_ids: Joi.array().items(Joi.string()).min(1).required(),
});

// Create a new transaction
export async function createTransaction(req, res) {
  try {
    const { error } = transactionSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const transactionData = req.body;

    const transactionRef = firestore.collection('transactions').doc();
    const transactionId = transactionRef.id;

    const completeTransactionData = { ...transactionData, transaction_id: transactionId };

    await transactionRef.set(completeTransactionData);

    // Log transaction creation
    await logEvent('Transaction Created', req.user.user_id, completeTransactionData);

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
      return res.status(404).send({ message: 'Transaction not found' });
    }

    res.status(200).send(transactionDoc.data());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get all transactions
export async function getAllTransactions(req, res) {
  try {
    const transactionSnapshot = await firestore.collection('transactions').get();

    if (transactionSnapshot.empty) {
      return res.status(404).send({ message: 'No transactions found' });
    }

    const transactions = [];
    transactionSnapshot.forEach((doc) => transactions.push(doc.data()));

    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get transactions by user ID
export async function getTransactionsByUser(req, res) {
  try {
    const userId = req.params.user_id;

    const transactionSnapshot = await firestore.collection('transactions')
      .where('user_id', '==', userId)
      .get();

    if (transactionSnapshot.empty) {
      return res.status(404).send({ message: 'No transactions found for this user.' });
    }

    const transactions = [];
    transactionSnapshot.forEach(doc => transactions.push(doc.data()));

    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get multiple transactions by list of IDs
export async function getTransactionsByIds(req, res) {
  try {
    const { error } = transactionIdListSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { transaction_ids } = req.body;

    const transactionSnapshot = await firestore.collection('transactions')
      .where('transaction_id', 'in', transaction_ids)
      .get();

    if (transactionSnapshot.empty) {
      return res.status(404).send({ message: 'No transactions found for the given IDs.' });
    }

    const transactions = [];
    transactionSnapshot.forEach(doc => transactions.push(doc.data()));

    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a transaction
export async function updateTransaction(req, res) {
  try {
    const transactionId = req.params.id;
    const updates = req.body;

    const updateSchema = transactionSchema.fork(
      Object.keys(transactionSchema.describe().keys),
      (field) => field.optional()
    );

    const { error } = updateSchema.validate(updates);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const transactionRef = firestore.collection('transactions').doc(transactionId);
    const transactionDoc = await transactionRef.get();
    if (!transactionDoc.exists) {
      return res.status(404).send({ message: 'Transaction not found' });
    }

    await transactionRef.update(updates);

    // Log transaction update
    await logEvent('Transaction Updated', req.user.user_id, updates);

    res.status(200).send({ message: 'Transaction updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a transaction
export async function deleteTransaction(req, res) {
  try {
    const transactionId = req.params.id;

    const transactionRef = firestore.collection('transactions').doc(transactionId);
    const transactionDoc = await transactionRef.get();
    if (!transactionDoc.exists) {
      return res.status(404).send({ message: 'Transaction not found' });
    }

    await transactionRef.delete();

    // Log transaction deletion
    await logEvent('Transaction Deleted', req.user.user_id, { transaction_id: transactionId });

    res.status(200).send({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}



*/



