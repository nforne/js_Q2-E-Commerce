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
import { logEvent } from '../services/logging.js';

// Reference Firestore
const firestore = gDB.db;

// Joi schema for product validation
const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.object({
    text: Joi.string().max(500).required(),
    images: Joi.array().items(Joi.string().uri()).optional(),
  }).required(),
  price: Joi.number().positive().required(),
  stock_quantity: Joi.number().integer().min(0).required(),
  category_id: Joi.string().required(),
  business_id: Joi.string().required(),
});

// Joi schema for product ID list validation
const productIdListSchema = Joi.object({
  product_ids: Joi.array().items(Joi.string()).min(1).required(),
});

// Create a new product
export async function createProduct(req, res) {
  try {
    if (req.user.role !== 'vendor') {
      return res.status(403).send({ message: 'Forbidden: Only vendors can create products.' });
    }

    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const productData = req.body;

    const productRef = firestore.collection('products').doc();
    const productId = productRef.id;

    const completeProductData = { ...productData, product_id: productId };

    await productRef.set(completeProductData);

    // Log product creation
    await logEvent('Product Created', req.user.user_id, completeProductData);

    res.status(201).send({ message: 'Product created successfully.', productId });
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
      return res.status(404).send({ message: 'Product not found.' });
    }

    res.status(200).send(productDoc.data());
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
    productSnapshot.forEach(doc => products.push(doc.data()));

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get products by user ID (Vendor)
export async function getProductsByUser(req, res) {
  try {
    const userId = req.params.user_id;
    const productSnapshot = await firestore.collection('products').where('business_id', '==', userId).get();

    if (productSnapshot.empty) {
      return res.status(404).send({ message: 'No products found for this vendor.' });
    }

    const products = [];
    productSnapshot.forEach(doc => products.push(doc.data()));

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get products by category ID
export async function getProductsByCategory(req, res) {
  try {
    const categoryId = req.params.category_id;
    const productSnapshot = await firestore.collection('products').where('category_id', '==', categoryId).get();

    if (productSnapshot.empty) {
      return res.status(404).send({ message: 'No products found in this category.' });
    }

    const products = [];
    productSnapshot.forEach(doc => products.push(doc.data()));

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get products by business ID
export async function getProductsByBusiness(req, res) {
  try {
    const businessId = req.params.business_id;
    const productSnapshot = await firestore.collection('products').where('business_id', '==', businessId).get();

    if (productSnapshot.empty) {
      return res.status(404).send({ message: 'No products found for this business.' });
    }

    const products = [];
    productSnapshot.forEach(doc => products.push(doc.data()));

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get multiple products by list of IDs
export async function getProductsByIds(req, res) {
  try {
    const { error } = productIdListSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { product_ids } = req.body;

    const productSnapshot = await firestore.collection('products')
      .where('product_id', 'in', product_ids)
      .get();

    if (productSnapshot.empty) {
      return res.status(404).send({ message: 'No products found for the given IDs.' });
    }

    const products = [];
    productSnapshot.forEach(doc => products.push(doc.data()));

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a product
export async function updateProduct(req, res) {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const productRef = firestore.collection('products').doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).send({ message: 'Product not found.' });
    }

    await productRef.update(updates);

    // Log product update
    await logEvent('Product Updated', req.user.user_id, updates);

    res.status(200).send({ message: 'Product updated successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a product
export async function deleteProduct(req, res) {
  try {
    const productId = req.params.id;

    await firestore.collection('products').doc(productId).delete();

    await logEvent('Product Deleted', req.user.user_id, { product_id: productId });

    res.status(200).send({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}




*/
