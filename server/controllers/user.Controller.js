import gDB from "../config/firebaseConfig.js";
import Joi from "joi";
import {
  verifyPassword,
  generateJwtToken,
  hashPassword,
} from "./auth.Controller.js";
import { logEvent } from "../services/logging.js";

// Reference Firestore
const firestore = gDB.db;

// Validation schemas
const userSchema = Joi.object({
  user_id: Joi.string(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("customer", "vendor", "administrator").required(),
  created_at: Joi.string(),
  shopping_cart: Joi.array().items(
    Joi.object({
      product_id: Joi.string(),
      price: Joi.number().positive().required(),
      quantity: Joi.number().positive().required(),
    })
  ),
  transactions: Joi.array().items(Joi.string()),
  address: Joi.object({
    default: Joi.object(),
    archive: Joi.array()
  }),
  payment_method: Joi.object({
    default: Joi.object(),
    archive: Joi.array()
    // card_number: Joi.string().creditCard().required(),
    // expiry_date: Joi.string().required(),
  }),
  privileges: Joi.object(),
  messages: Joi.array().items(
    Joi.object()
  ),
});

// Sign-In and JWT Generation
/*
// jwt in authorization header
export async function signIn(req, res) {
  try {
    const signInSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
    });

    const { error } = signInSchema.validate(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });

    const { email, password } = req.body;

    const userSnapshot = await firestore.collection('users').where('email', '==', email).get();

    if (userSnapshot.empty) {
      return res.status(404).send({ message: 'User not found.' });
    }

    const user = userSnapshot.docs[0].data();

    const passwordMatch = verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    const token = generateJwtToken(user);

    // Log user sign-in
    await logEvent('User Sign-In', user.user_id, { email });

    res.status(200).send({ message: 'Sign-in successful.', token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

*/

// jwt in cookie
export async function signIn(req, res) {
  try {
    const signInSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
    });

    const { error } = signInSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const { email, password } = req.body;

    const userSnapshot = await firestore
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).send({ message: "User not found." });
    }

    const user = userSnapshot.docs[0].data();

    const passwordMatch = verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    const token = generateJwtToken(user);

    // Log user sign-in
    await logEvent("User Sign-In", user.user_id, { email });

    // Set JWT as a secure HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true, // Prevent access via JavaScript
      secure: process.env.NODE_ENV === "production", // Set Secure flag in HTTPS
      sameSite: "Strict", // Mitigate CSRF attacks
      maxAge: 3600000, // Token expires in 1 hour
    });

    res.status(200).send({ message: "Sign-in successful." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Create a new user
export async function createUser(req, res) {
  try {
    const { error } = userSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    req.body.password = hashPassword(req.body.password);

    const userData = req.body;
    const userRef = firestore.collection("users").doc();
    const userId = userRef.id;

    const completeUserData = { ...userData, user_id: userId };

    await userRef.set(completeUserData);

    // Log user creation
    await logEvent("User Created", userId, completeUserData);

    // await signIn(req, res);

    const token = generateJwtToken(completeUserData);

    // Set JWT as a secure HTTP-only cookie
    res.cookie("jwt", token, {
      httpOnly: true, // Prevent access via JavaScript
      secure: process.env.NODE_ENV === "production", // Set Secure flag in HTTPS
      sameSite: "Strict", // Mitigate CSRF attacks
      maxAge: 3600000, // Token expires in 1 hour
    });


    res.status(201).send({ message: "User created successfully.", userId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get a specific user by ID
export async function getUser(req, res) {
  try {
    const userId = req.params.id;
    const userDoc = await firestore.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Update a user by ID
export async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const updateSchema = userSchema.fork(
      Object.keys(userSchema.describe().keys),
      (field) => field.optional()
    );
    const { error } = updateSchema.validate(updates);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).send({ message: "User not found." });
    }

    await userRef.update(updates);

    // Log user update
    await logEvent("User Updated", userId, updates);

    res.status(200).send({ message: "User updated successfully." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Delete a user by ID
export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    const userRef = firestore.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).send({ message: "User not found." });
    }

    await userRef.delete();

    // Log user deletion
    await logEvent("User Deleted", userId, {});

    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

// Get all users
export async function getAllUsers(req, res) {
  try {
    const userSnapshot = await firestore.collection("users").get();

    if (userSnapshot.empty) {
      return res.status(404).send({ message: "No users found." });
    }

    const users = [];
    userSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}