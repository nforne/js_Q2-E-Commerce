import gDB from '../config/firebaseConfig.js';

// Reference Firestore
const firestore = gDB.db;

// Create a new product
export async function createProduct(req, res) {
  try {
    const productData = req.body;

    // Generate a unique product ID (Firestore document ID)
    const productRef = firestore.collection('products').doc();
    const productId = productRef.id;

    // Add product_id to the product object
    const completeProductData = { ...productData, product_id: productId };

    // Save the product in Firestore
    await productRef.set(completeProductData);

    res.status(201).send({ message: 'Product created successfully', productId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get a specific product by ID
export async function getProduct(req, res) {
  try {
    const productId = req.params.id;
    const productDoc = await firestore.collection('products').doc(productId).get();

    if (!productDoc.exists) {
      return res.status(404).send({ message: 'Product not found' });
    }

    res.status(200).send(productDoc.data());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a product's details by ID
export async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const updates = req.body;

    // Check if product exists
    const productRef = firestore.collection('products').doc(productId);
    const productDoc = await productRef.get();
    if (!productDoc.exists) {
      return res.status(404).send({ message: 'Product not found' });
    }

    // Update the product in Firestore
    await productRef.update(updates);

    res.status(200).send({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a product by ID
export async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;

    // Check if product exists
    const productRef = firestore.collection('products').doc(productId);
    const productDoc = await productRef.get();
    if (!productDoc.exists) {
      return res.status(404).send({ message: 'Product not found' });
    }

    // Delete the product in Firestore
    await productRef.delete();

    res.status(200).send({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get all products
export async function getAllProducts(req, res) {
  try {
    const productSnapshot = await firestore.collection('products').get();

    if (productSnapshot.empty) {
      return res.status(404).send({ message: 'No products found' });
    }

    const products = [];
    productSnapshot.forEach(doc => {
      products.push(doc.data());
    });

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}


// -----------------------------------------------------------------------------------------------------------
/*
import gDB from '../config/firebaseConfig.js';
import Joi from 'joi';
import Product from '../models/product.model.js';

// Reference Firestore
const firestore = gDB.db;

// Joi schema for products
const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(), // Product name
  description: Joi.string().max(500).required(), // Description with max length of 500 characters
  price: Joi.number().positive().required(), // Price must be positive
  stock_quantity: Joi.number().integer().min(0).required(), // Stock cannot be negative
  category_id: Joi.string().required(), // Category ID
  business_id: Joi.string().required(), // Business ID
  reorder_threshold: Joi.number().integer().min(0).optional(), // Optional threshold for reorder
});

// Create a new product
export async function createProduct(req, res) {
  try {
    if (req.user.role !== 'vendor' || !req.user.privileges.productManagement?.isGranted) {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to create a product.' });
    }

    // Validate user input
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const productData = req.body;
    const completeProductData = {
      ...productData,
      business_id: req.user.user_id,
    };

    const productRef = firestore.collection('products').doc();
    const productId = productRef.id;
    completeProductData.product_id = productId;

    await productRef.set(completeProductData);

    res.status(201).send({ message: 'Product created successfully.', productId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get a specific product
export async function getProduct(req, res) {
  try {
    const productId = req.params.id;
    const productDoc = await firestore.collection('products').doc(productId).get();

    if (!productDoc.exists) {
      return res.status(404).send({ message: 'Product not found.' });
    }

    res.status(200).send(productDoc.data());
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a product
export async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const updates = req.body;

    // Make fields optional for updates
    const updateSchema = productSchema.fork(Object.keys(productSchema.describe().keys), (field) => field.optional());

    const { error } = updateSchema.validate(updates);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const productRef = firestore.collection('products').doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).send({ message: 'Product not found.' });
    }

    const productData = productDoc.data();

    if (req.user.role === 'vendor' && productData.business_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only update products you manage.' });
    } else if (req.user.role !== 'administrator' && req.user.role !== 'vendor') {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to update products.' });
    }

    await productRef.update(updates);

    res.status(200).send({ message: 'Product updated successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a product
export async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;

    const productRef = firestore.collection('products').doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).send({ message: 'Product not found.' });
    }

    const productData = productDoc.data();

    if (req.user.role === 'vendor' && productData.business_id !== req.user.user_id) {
      return res.status(403).send({ message: 'Forbidden: You can only delete products you manage.' });
    } else if (req.user.role !== 'administrator' && req.user.role !== 'vendor') {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to delete products.' });
    }

    await productRef.delete();

    res.status(200).send({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get all products
export async function getAllProducts(req, res) {
  try {
    const productSnapshot = await firestore.collection('products').get();

    if (productSnapshot.empty) {
      return res.status(404).send({ message: 'No products found.' });
    }

    const products = [];
    productSnapshot.forEach((doc) => {
      products.push(doc.data());
    });

    if (req.user.role === 'vendor') {
      const vendorProducts = products.filter((product) => product.business_id === req.user.user_id);
      return res.status(200).send(vendorProducts);
    } else if (req.user.role !== 'administrator' && req.user.role !== 'vendor') {
      return res.status(403).send({ message: 'Forbidden: Insufficient privileges to view all products.' });
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Trigger reorder alert on purchase
export async function handlePurchase(req, res) {
  try {
    const { products } = req.body;

    for (const { product_id, quantity } of products) {
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

      await productRef.update({ stock_quantity: updatedStock });

      // Trigger reorder alert
      if (updatedStock <= productData.reorder_threshold) {
        console.log(`Reorder Alert: Stock for product "${productData.name}" is below the threshold.`);
        // Notify vendor (email/notification logic goes here)
      }
    }

    res.status(200).send({ message: 'Purchase processed successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}



*/
