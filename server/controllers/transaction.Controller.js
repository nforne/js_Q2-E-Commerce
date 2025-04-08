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

// Create a new transaction
export async function createTransaction(req, res) {
  try {
    // Validate user input
    const { error } = transactionSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const transactionData = req.body;

    // Generate a unique transaction ID
    const transactionRef = firestore.collection('transactions').doc();
    const transactionId = transactionRef.id;

    // Add transaction ID to the transaction object
    const completeTransactionData = { ...transactionData, transaction_id: transactionId };

    // Save the transaction in Firestore
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

    // Make all fields optional for updates
    const updateSchema = transactionSchema.fork(
      Object.keys(transactionSchema.describe().keys),
      (field) => field.optional()
    );

    // Validate the updates
    const { error } = updateSchema.validate(updates);
    if (error) return res.status(400).send({ message: error.details[0].message });

    // Check if the transaction exists
    const transactionRef = firestore.collection('transactions').doc(transactionId);
    const transactionDoc = await transactionRef.get();
    if (!transactionDoc.exists) {
      return res.status(404).send({ message: 'Transaction not found' });
    }

    // Update the transaction
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
    transactionSnapshot.forEach((doc) => {
      transactions.push(doc.data());
    });

    res.status(200).send(transactions);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

*/
// -----------------------------------------------------------------------------------------------------------
/*
import gDB from '../config/firebaseConfig.js';

// Reference Firestore
const firestore = gDB.db;

// Create a new transaction (Customers only)
export async function createTransaction(req, res) {
  try {
    // Validate customer privileges
    if (req.user.role !== 'customer' || !req.user.privileges.shopping?.isGranted) {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to create a transaction.' });
    }

    const transactionData = req.body;

    // Iterate through products to adjust stock and trigger reorder alerts
    for (const { product_id, quantity } of transactionData.products) {
      const productRef = firestore.collection('products').doc(product_id);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        return res.status(404).send({ message: `Product with ID ${product_id} not found.` });
      }

      const productData = productDoc.data();

      // Adjust stock quantity
      const updatedStock = productData.stock_quantity - quantity;
      if (updatedStock < 0) {
        return res.status(400).send({ message: `Insufficient stock for product: ${productData.name}.` });
      }

      // Update stock in Firestore
      await productRef.update({ stock_quantity: updatedStock });

      // Trigger reorder alert
      if (updatedStock <= productData.reorder_threshold) {
        console.log(`Reorder Alert: Stock for product "${productData.name}" is below the threshold (${productData.reorder_threshold}).`);
        // Add vendor notification logic here (e.g., email or system notification)
      }
    }

    // Generate a unique transaction ID
    const transactionRef = firestore.collection('transactions').doc();
    const transactionId = transactionRef.id;

    // Prepare complete transaction data
    const completeTransactionData = {
      ...transactionData,
      transaction_id: transactionId,
      user_id: req.user.user_id, // Link transaction to the buyer
      created_at: new Date(),
    };

    // Save the transaction to Firestore
    await transactionRef.set(completeTransactionData);

    res.status(201).send({ message: 'Transaction created successfully.', transactionId });
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

    // Restrict access based on roles
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

// Update a transaction
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

    // Update transaction in Firestore
    await transactionRef.update(updates);

    res.status(200).send({ message: 'Transaction updated successfully.' });
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
      return res.status(404).send({ message: 'Transaction not found.' });
    }

    const transactionData = transactionDoc.data();

    // Restrict deletion based on roles
    if (req.user.role === 'vendor' && transactionData.vendor_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only delete transactions related to your products.' });
    } else if (req.user.role !== 'administrator' && req.user.role !== 'vendor') {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to delete transactions.' });
    }

    // Delete the transaction from Firestore
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
    transactionSnapshot.forEach((doc) => {
      transactions.push(doc.data());
    });

    // Filter transactions based on roles
    if (req.user.role === 'vendor') {
      const vendorTransactions = transactions.filter(
        (transaction) => transaction.vendor_id === req.user.user_id
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

// -----------------------------------------------------------------------------------------------------------
/*

*/

