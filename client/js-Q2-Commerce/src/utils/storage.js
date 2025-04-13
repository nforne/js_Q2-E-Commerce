import { encryptData, decryptData } from "./security";

const MAX_CASUAL_TRANSACTIONS = 2;
const MAX_CART_ITEMS = 5;

/**
 * Securely store shopping cart items for casual users.
 */
export const storeCartItems = (cart) => {
  const limitedCart = cart.slice(0, MAX_CART_ITEMS);
  localStorage.setItem("js-q2-ec-cart", encryptData(limitedCart));
};

/**
 * Securely store transactions for casual users.
 */
export const storeTransactions = (transactions) => {
  const limitedTransactions = transactions.slice(0, MAX_CASUAL_TRANSACTIONS);
  localStorage.setItem("js-q2-ec-transactions", encryptData(limitedTransactions));
};

/**
 * Retrieve encrypted shopping cart items for casual users.
 */
export const getCartItems = () => {
  const storedCart = localStorage.getItem("js-q2-ec-cart");
  return storedCart ? decryptData(storedCart).slice(0, MAX_CART_ITEMS) : [];
};

/**
 * Retrieve encrypted transactions for casual users.
 */
export const getTransactions = () => {
  const storedTransactions = localStorage.getItem("js-q2-ec-transactions");
  return storedTransactions ? decryptData(storedTransactions).slice(0, MAX_CASUAL_TRANSACTIONS) : [];
};

/**
 * Migrates casual user data (cart & transactions) to backend upon registration.
 */
export const migrateCasualData = async (userId, uploadToBackend) => {
  const cartItems = getCartItems();
  const transactions = getTransactions();

  await uploadToBackend(userId, { cartItems, transactions });

  // Cleanup local storage after migration
  localStorage.removeItem("js-q2-ec-cart");
  localStorage.removeItem("js-q2-ec-transactions");
};
