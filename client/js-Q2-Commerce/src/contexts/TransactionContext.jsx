import { createContext, useState, useEffect } from "react";
import { encryptData, decryptData } from "../utils/security"; // Secure encryption utilities
import { migrateCasualData } from "../utils/storage"; // Handles local-to-backend migration
import { useAuth } from "./AuthContext"; // Authentication context for transition handling

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth(); // Authentication state tracking
  const [transactions, setTransactions] = useState(() => {
    const storedTransactions = localStorage.getItem("js-q2-ec-transactions");
    return storedTransactions ? decryptData(storedTransactions) : [];
  });

  useEffect(() => {
    localStorage.setItem("js-q2-ec-transactions", encryptData(transactions));
  }, [transactions]);

  useEffect(() => {
    if (isAuthenticated && user) {
      migrateCasualData(user.user_id, { transactions });
      localStorage.removeItem("js-q2-ec-transactions"); // Cleanup local storage after migration
    }
  }, [isAuthenticated, user]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction].slice(-2)); // Casual users limited to 2 transactions
    localStorage.setItem("js-q2-ec-transactions", encryptData(transactions));
  };

  const clearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem("js-q2-ec-transactions");
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, clearTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};
