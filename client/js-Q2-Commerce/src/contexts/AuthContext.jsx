import { createContext, useContext, useState, useEffect } from "react";
import { signIn, signOut, migrateUserData } from "../services/authService";
import { updateUser } from "../services/userService";
import { getTransactionsByUser, getTransactionsByIds, getMessagesByUser, getMessagesByIds, getReviewsByUser, getReviewsByIds, getProductsByUser, getProductsByIds } from "../services/dataService";
import { getCartItems, storeCartItems, getTransactions, storeTransactions } from "../utils/storage";
import { encryptData, decryptData } from "../utils/security";
import { User } from "../models.js/user.model";
import rootAdmin from "../mockData/rootAdmin"; // Importing rootAdmin

export const AuthContext = createContext();

// Custom hook for easy authentication state access
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("js-q2-ec-user");
    const decryptedUser = storedUser ? decryptData(storedUser) : null;
    return decryptedUser || rootAdmin; // Ensure rootAdmin is used if no user is found
  });

  const [isAuthenticated, setIsAuthenticated] = useState(user?.user_id !== null);
  const [cart, setCart] = useState(() => getCartItems()); // Retrieve encrypted cart data
  const [transactions, setTransactions] = useState(() => getTransactions()); // Retrieve encrypted transactions

  // Effect to manage local storage updates for user state changes
  useEffect(() => {
    if (user && !isAuthenticated) {
      localStorage.setItem("js-q2-ec-user", encryptData(user)); // Encrypt and store user locally
    } else if (isAuthenticated) {
      localStorage.removeItem("js-q2-ec-user"); // Clear local storage for authenticated users
    }
  }, [user, isAuthenticated]);

  /**
   * Authenticate user and update frontend state with local data
   */
  const authenticateUser = async (credentials) => {
    try {
      const userData = await signIn(credentials);
      if (userData) {
        setUser(new User(userData));
        setIsAuthenticated(true);

        // Retrieve local data and update frontend state
        const { cart: localCart, transactions: localTransactions } = migrateUserData();
        setCart(localCart); // Update cart state with local data
        setTransactions(localTransactions); // Update transactions state with local data

        // Now remove the local data after updating the frontend state
        localStorage.removeItem("js-q2-ec-cart");
        localStorage.removeItem("js-q2-ec-transactions");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  /**
   * Logout user and clear states
   */
  const logoutUser = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);

      // Store anonymous user state securely
      localStorage.setItem("js-q2-ec-user", encryptData({ user_id: null, isAnonymous: true }));
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /**
   * Fetch transactions based on the user's state
   */
  const fetchTransactions = async () => {
    return isAuthenticated ? await getTransactionsByUser(user.user_id) : getTransactions();
  };

  /**
   * Fetch transactions by specific IDs
   */
  const fetchTransactionsByIds = async (transactionIds) => {
    return isAuthenticated && transactionIds?.length ? await getTransactionsByIds(transactionIds) : [];
  };

  /**
   * Fetch products based on the user's state
   */
  const fetchProducts = async () => {
    return isAuthenticated ? await getProductsByUser(user.user_id) : getCartItems();
  };

  /**
   * Fetch products by specific IDs
   */
  const fetchProductsByIds = async (productIds) => {
    return isAuthenticated && productIds?.length ? await getProductsByIds(productIds) : [];
  };

  /**
   * Fetch messages based on the user's state
   */
  const fetchMessages = async () => {
    return isAuthenticated ? await getMessagesByUser(user.user_id) : [];
  };

  /**
   * Fetch messages by specific IDs
   */
  const fetchMessagesByIds = async (messageIds) => {
    return isAuthenticated && messageIds?.length ? await getMessagesByIds(messageIds) : [];
  };

  /**
   * Fetch reviews based on the user's state
   */
  const fetchReviews = async () => {
    return isAuthenticated ? await getReviewsByUser(user.user_id) : [];
  };

  /**
   * Fetch reviews by specific IDs
   */
  const fetchReviewsByIds = async (reviewIds) => {
    return isAuthenticated && reviewIds?.length ? await getReviewsByIds(reviewIds) : [];
  };

  /**
   * Add a product to the cart
   */
  const addToCart = (product) => {
    const updatedCart = [...cart, product].slice(0, 5); // Limit casual users to 5 items
    setCart(updatedCart);
    storeCartItems(updatedCart); // Encrypt & store cart items
  };

  /**
   * Add a transaction to the list
   */
  const addTransaction = (transaction) => {
    const updatedTransactions = [...transactions, transaction].slice(0, 2); // Limit casual users to 2 transactions
    setTransactions(updatedTransactions);
    storeTransactions(updatedTransactions); // Encrypt & store transaction history
  };

  // Effect to update user data on the backend when state changes
  useEffect(() => {
    if (user && isAuthenticated) {
      updateUser(user);
    }
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authenticateUser,
        logoutUser,
        fetchTransactions,
        fetchTransactionsByIds,
        fetchProducts,
        fetchProductsByIds,
        fetchMessages,
        fetchMessagesByIds,
        fetchReviews,
        fetchReviewsByIds,
        cart,
        transactions,
        addToCart,
        addTransaction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
