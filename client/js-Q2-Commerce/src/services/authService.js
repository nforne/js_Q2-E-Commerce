import axios from "axios";
import { encryptData, decryptData } from "../utils/security";
// import { migrateLocalDataToBackend } from "../utils/storage";

const API_URL = "https://your-api.com";

/**
 * Retrieve JWT securely from Authorization header or HTTP-only cookie.
 * If found in header, store it in **encrypted local storage**.
 * @param {Object} req - Express request object.
 * @returns {string|null} - JWT token or null if not found.
 */
export const getJwtToken = (req) => {
  let token = req.headers["authorization"]?.split(" ")[1];

  if (!token && req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (token && req.headers["authorization"]) {
    localStorage.setItem("jwtToken", encryptData(token)); // 🔒 Encrypt & store JWT
  }

  return token;
};

/**
 * Sign in the user, store JWT securely if returned in the header.
 * @param {Object} credentials - User login credentials.
 * @returns {Promise<Object|null>} - Authenticated user data.
 */
export const signIn = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      withCredentials: true,
    });

    const token = response.headers["authorization"]?.split(" ")[1];
    if (token) {
      localStorage.setItem("jwtToken", encryptData(token)); // 🔒 Securely store JWT
    }

    return response.data;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
};

/**
 * Logout user, remove JWT from encrypted storage, and clear cookie.
 */
export const signOut = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });

    localStorage.removeItem("jwtToken"); // 🔒 Securely erase stored JWT
  } catch (error) {
    console.error("Sign-out failed:", error);
    throw error;
  }
};

/**
 * Fetch user data securely, ensuring JWT is included automatically via cookies.
 * @returns {Promise<Object>} - User profile data.
 */
export const fetchUserData = async () => {
  try {
    const token = decryptData(localStorage.getItem("jwtToken"));

    const response = await axios.get(`${API_URL}/users/me`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};

/**
 * Save sensitive transaction data (like credit card info) in encrypted local storage.
 * @param {Array} transactions - List of transactions including credit card info.
 */
export const saveTransactionsLocally = (transactions) => {
  try {
    const encryptedTransactions = encryptData(transactions); // 🔒 Encrypt transactions
    localStorage.setItem("js-q2-ec-transactions", encryptedTransactions);
  } catch (error) {
    console.error("Failed to save encrypted transactions:", error);
  }
};

/**
 * Retrieve encrypted transactions from local storage and decrypt them.
 * @returns {Array} - List of decrypted transactions.
 */
export const getTransactionsLocally = () => {
  try {
    const encryptedTransactions = localStorage.getItem("js-q2-ec-transactions");
    return encryptedTransactions ? decryptData(encryptedTransactions) : [];
  } catch (error) {
    console.error("Failed to retrieve encrypted transactions:", error);
    return [];
  }
};

/**
 * Migrate user data by reading from local storage and updating the frontend state.
 * The frontend automatically syncs these changes with the backend.
 * @returns {Object} - Returns decrypted cart and transactions.
 */
export const migrateUserData = () => {
  try {
    const cart = decryptData(localStorage.getItem("js-q2-ec-cart")) || [];
    const transactions = getTransactionsLocally(); // Retrieve decrypted transactions

    return { cart, transactions };
  } catch (error) {
    console.error("Failed to migrate user data:", error);
    return { cart: [], transactions: [] }; // Fallback to empty arrays in case of errors
  }
};

// /**
//  * Migrate user data (cart & transactions) to backend upon registration.
//  * @param {string} userId - Authenticated user ID.
//  */
// export const migrateUserData = async (userId) => {
//   try {
//     const cart = decryptData(localStorage.getItem("js-q2-ec-cart")) || [];
//     const transactions = getTransactionsLocally(); // Retrieve decrypted transactions

//     await migrateLocalDataToBackend(cart, transactions, userId);

//     localStorage.removeItem("js-q2-ec-cart");
//     localStorage.removeItem("js-q2-ec-transactions");
//   } catch (error) {
//     console.error("Error migrating local data:", error);
//     throw error;
//   }
// };

/**
 * Save sensitive user information (including credit card) in encrypted local storage.
 * @param {Object} userData - Includes sensitive data like credit card info.
 */
export const saveUserLocally = (userData) => {
  try {
    const encryptedUserData = encryptData(userData); // 🔒 Encrypt sensitive data
    localStorage.setItem("js-q2-ec-user", encryptedUserData);
  } catch (error) {
    console.error("Failed to save user data locally:", error);
  }
};

/**
 * Retrieve sensitive user data from local storage and decrypt it.
 * @returns {Object} - Decrypted user data.
 */
export const getUserLocally = () => {
  try {
    const encryptedUserData = localStorage.getItem("js-q2-ec-user");
    return encryptedUserData ? decryptData(encryptedUserData) : null;
  } catch (error) {
    console.error("Failed to retrieve user data locally:", error);
    return null;
  }
};

/**
 * Fetch transactions by user ID.
 * @param {string} userId - ID of the user.
 * @returns {Promise<Array>} - List of transactions.
 */
export const getTransactionsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/transactions`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    throw error;
  }
};

/**
 * Fetch messages by user ID.
 * @param {string} userId - ID of the user.
 * @returns {Promise<Array>} - List of messages.
 */
export const getMessagesByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/messages`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
};

/**
 * Fetch reviews by user ID.
 * @param {string} userId - ID of the user.
 * @returns {Promise<Array>} - List of reviews.
 */
export const getReviewsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/reviews`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    throw error;
  }
};
