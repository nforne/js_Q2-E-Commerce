import { encryptData, decryptData } from "./security";
import { updateUser } from "../services/userService";
const MAX_CASUAL_TRANSACTIONS = 2;
const MAX_CART_ITEMS = 5;

/**
 * Securely store shopping cart items for casual users.
 * @param {Array} cart - Array of cart items
 */
export const storeCartItems = (cart) => {
  const limitedCart = cart.slice(0, MAX_CART_ITEMS);
  localStorage.setItem("js-q2-ec-cart", encryptData(limitedCart));
};

/**
 * Securely store transactions for casual users.
 * @param {Array} transactions - Array of transactions
 */
export const storeTransactions = (transactions) => {
  const limitedTransactions = transactions.slice(0, MAX_CASUAL_TRANSACTIONS);
  localStorage.setItem("js-q2-ec-transactions", encryptData(limitedTransactions));
};

/**
 * Retrieve encrypted shopping cart items for casual users.
 * @returns {Array} - Decrypted array of cart items
 */
export const getCartItems = () => {
  const storedCart = localStorage.getItem("js-q2-ec-cart");
  return storedCart ? decryptData(storedCart).slice(0, MAX_CART_ITEMS) : [];
};

/**
 * Retrieve encrypted transactions for casual users.
 * @returns {Array} - Decrypted array of transactions
 */
export const getTransactions = () => {
  const storedTransactions = localStorage.getItem("js-q2-ec-transactions");
  return storedTransactions ? decryptData(storedTransactions).slice(0, MAX_CASUAL_TRANSACTIONS) : [];
};


/**
 * Uploads casual user data from local storage to the backend via AuthContext.
 * This updates the user's cart and transactions in the app state.
 * @param {string} userId - The authenticated user's ID
 * @param {Object} data - The data to upload (cartItems and transactions)
 * @param {Function} updateUser - Function from AuthContext to update the user
 */
export const uploadToBackend = async (userId, { cartItems, transactions }) => {
  try {
    // Simulate a backend process - Here, we directly update AuthContext
    const updatedUserData = {
      shopping_cart: cartItems, // Cart items from local storage
      transactions: [...transactions], // Transactions from local storage
    };

    // Update the user in AuthContext
    await updateUser({ user_id: userId, ...updatedUserData });

    console.log("Casual user data successfully uploaded to the AuthContext.");
  } catch (error) {
    console.error("Failed to upload casual user data to backend:", error);
  }
};


/**
 * Migrates casual user data (cart & transactions) to backend upon registration.
 * @param {string} userId - The authenticated user's ID
 * @param {Function} uploadToBackend - Function to process and upload the data
 */
export const migrateCasualData = async (userId) => {
  const cartItems = getCartItems();
  const transactions = getTransactions();

  await uploadToBackend(userId, { cartItems, transactions });

  // Cleanup local storage after migration
  localStorage.removeItem("js-q2-ec-cart");
  localStorage.removeItem("js-q2-ec-transactions");
};


