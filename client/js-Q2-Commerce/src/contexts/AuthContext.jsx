import { createContext, useState, useEffect } from "react";
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

export default AuthProvider;



// https://copilot.microsoft.com/chats/AM3HUpb2aqJP2ZAgPtC41