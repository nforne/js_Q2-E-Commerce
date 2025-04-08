import { createContext, useState, useEffect } from "react";
import { migrateLocalDataToBackend } from "../services/migrateDataService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("user");
      setIsAuthenticated(false);
    }
  });
};
// https://copilot.microsoft.com/chats/AM3HUpb2aqJP2ZAgPtC41