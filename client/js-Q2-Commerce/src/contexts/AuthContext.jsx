import { createContext, useContext, useState, useEffect } from "react";
import { signIn, signOut, migrateUserData } from "../services/authService";
import { getUser, updateUser } from "../services/userService";
import { getTransactionsByUser, getTransactionsByIds, getMessagesByUser, getMessagesByIds, getReviewsByUser, getReviewsByIds, getProductsByUser, getProductsByIds } from "../services/dataService";
import { getCartItems, storeCartItems, getTransactions, storeTransactions } from "../utils/storage";
import { encryptData, decryptData } from "../utils/security"; 
import { User } from "../models/user.model";
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
  const [cart, setCart] = useState(() => getCartItems());
  const [transactions, setTransactions] = useState(() => getTransactions());

  useEffect(() => {
    if (user && !isAuthenticated) {
      localStorage.setItem("js-q2-ec-user", encryptData(user));
    } else if (isAuthenticated) {
      localStorage.removeItem("js-q2-ec-user");
    }
  }, [user, isAuthenticated]);

  const authenticateUser = async (credentials) => {
    try {
      const userData = await signIn(credentials);
      if (userData) {
        setUser(new User(userData));
        setIsAuthenticated(true);
        await migrateUserData(userData.user_id);
        localStorage.removeItem("js-q2-ec-user");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const logoutUser = async () => {
    await signOut();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.setItem("js-q2-ec-user", encryptData({ user_id: null, isAnonymous: true }));
  };

  const fetchTransactions = async () => {
    return isAuthenticated ? await getTransactionsByUser(user.user_id) : getTransactions();
  };

  const fetchTransactionsByIds = async (transactionIds) => {
    return isAuthenticated && transactionIds?.length ? await getTransactionsByIds(transactionIds) : [];
  };

  const fetchProducts = async () => {
    return isAuthenticated ? await getProductsByUser(user.user_id) : getCartItems();
  };

  const fetchProductsByIds = async (productIds) => {
    return isAuthenticated && productIds?.length ? await getProductsByIds(productIds) : [];
  };

  const fetchMessages = async () => {
    return isAuthenticated ? await getMessagesByUser(user.user_id) : [];
  };

  const fetchMessagesByIds = async (messageIds) => {
    return isAuthenticated && messageIds?.length ? await getMessagesByIds(messageIds) : [];
  };

  const fetchReviews = async () => {
    return isAuthenticated ? await getReviewsByUser(user.user_id) : [];
  };

  const fetchReviewsByIds = async (reviewIds) => {
    return isAuthenticated && reviewIds?.length ? await getReviewsByIds(reviewIds) : [];
  };

  const addToCart = (product) => {
    const updatedCart = [...cart, product].slice(0, 5);
    setCart(updatedCart);
    storeCartItems(updatedCart);
  };

  const addTransaction = (transaction) => {
    const updatedTransactions = [...transactions, transaction].slice(0, 2);
    setTransactions(updatedTransactions);
    storeTransactions(updatedTransactions);
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      updateUser(user);
    }
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ 
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
      addTransaction 
    }}>
      {children}
    </AuthContext.Provider>
  );
};



`import { createContext, useState, useEffect } from "react";
import { signIn, signOut, migrateUserData } from "../services/authService";
import { getUser, updateUser } from "../services/userService";
import { getTransactionsByUser, getTransactionsByIds, getMessagesByUser, getMessagesByIds, getReviewsByUser, getReviewsByIds, getProductsByUser, getProductsByIds } from "../services/dataService";
import { getCartItems, storeCartItems, getTransactions, storeTransactions, migrateCasualData } from "../utils/storage";
import { encryptData, decryptData } from "../utils/security"; 
import { User } from "../models/user.model";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Securely retrieve casual user from encrypted local storage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("js-q2-ec-user");
    return storedUser ? decryptData(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(user?.user_id !== null);
  const [cart, setCart] = useState(() => getCartItems()); // Retrieves encrypted cart data
  const [transactions, setTransactions] = useState(() => getTransactions()); // Retrieves encrypted transaction data

  useEffect(() => {
    if (user && !isAuthenticated) {
      localStorage.setItem("js-q2-ec-user", encryptData(user));
    } else if (isAuthenticated) {
      localStorage.removeItem("js-q2-ec-user");
    }
  }, [user, isAuthenticated]);

  const authenticateUser = async (credentials) => {
    const userData = await signIn(credentials);
    if (userData) {
      setUser(new User(userData));
      setIsAuthenticated(true);

      // Migrate casual user data (cart & transactions) to backend upon registration
      await migrateUserData(userData.user_id);

      // Remove encrypted local user storage after registration
      localStorage.removeItem("js-q2-ec-user");
    }
  };

  const logoutUser = async () => {
    await signOut();
    setUser(null);
    setIsAuthenticated(false);

    // Encrypt and store anonymous user session
    localStorage.setItem("js-q2-ec-user", encryptData({ user_id: null, isAnonymous: true }));
  };

  // Fetch correct transactions based on user type
  const fetchTransactions = async () => {
    return isAuthenticated ? await getTransactionsByUser(user.user_id) : getTransactions();
  };

  const fetchTransactionsByIds = async (transactionIds) => {
    return isAuthenticated && transactionIds?.length ? await getTransactionsByIds(transactionIds) : [];
  };

  // Fetch correct products based on user type
  const fetchProducts = async () => {
    return isAuthenticated ? await getProductsByUser(user.user_id) : getCartItems();
  };

  const fetchProductsByIds = async (productIds) => {
    return isAuthenticated && productIds?.length ? await getProductsByIds(productIds) : [];
  };

  // Fetch correct messages based on user type
  const fetchMessages = async () => {
    return isAuthenticated ? await getMessagesByUser(user.user_id) : [];
  };

  const fetchMessagesByIds = async (messageIds) => {
    return isAuthenticated && messageIds?.length ? await getMessagesByIds(messageIds) : [];
  };

  // Fetch correct reviews based on user type
  const fetchReviews = async () => {
    return isAuthenticated ? await getReviewsByUser(user.user_id) : [];
  };

  const fetchReviewsByIds = async (reviewIds) => {
    return isAuthenticated && reviewIds?.length ? await getReviewsByIds(reviewIds) : [];
  };

  const addToCart = (product) => {
    const updatedCart = [...cart, product].slice(0, 5); // Limit casual users to 5 items
    setCart(updatedCart);
    storeCartItems(updatedCart); // Encrypt & store cart items
  };

  const addTransaction = (transaction) => {
    const updatedTransactions = [...transactions, transaction].slice(0, 2); // Limit casual users to 2 transactions
    setTransactions(updatedTransactions);
    storeTransactions(updatedTransactions); // Encrypt & store transaction history
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      updateUser(user);
    }
  }, [user, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ 
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
      addTransaction 
    }}>
      {children}
    </AuthContext.Provider>
  );
};`



`import { createContext, useState, useEffect } from "react";
import { migrateLocalDataToBackend, fetchUserData, encryptData, decryptData } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("js-q2-ec-user");
    return storedUser ? decryptData(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(user?.id !== null);
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("js-q2-ec-cart");
    return storedCart ? decryptData(storedCart) : [];
  });

  const [orders, setOrders] = useState(() => {
    const storedOrders = localStorage.getItem("js-q2-ec-orders");
    return storedOrders ? decryptData(storedOrders) : [];
  });

  useEffect(() => {
    if (user && !isAuthenticated) {
      // Store anonymous user in local storage only after interaction
      localStorage.setItem("js-q2-ec-user", encryptData(user));
    } else if (isAuthenticated) {
      localStorage.removeItem("js-q2-ec-user");
    }
  }, [user, isAuthenticated]);

  // Handle authentication
  const authenticateUser = async (credentials) => {
    const backendUser = await fetchUserData(credentials);
    if (backendUser) {
      setUser(backendUser);
      setIsAuthenticated(true);

      // Migrate local cart & orders to backend
      if (cart.length > 0 || orders.length > 0) {
        await migrateLocalDataToBackend(cart, orders, backendUser.id);
        localStorage.removeItem("js-q2-ec-cart");
        localStorage.removeItem("js-q2-ec-orders");
      }

      localStorage.removeItem("js-q2-ec-user");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.setItem("js-q2-ec-user", encryptData({ id: null, isAnonymous: true }));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, authenticateUser, logout, cart, setCart, orders, setOrders }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;`



// https://copilot.microsoft.com/chats/AM3HUpb2aqJP2ZAgPtC41

/*




*/