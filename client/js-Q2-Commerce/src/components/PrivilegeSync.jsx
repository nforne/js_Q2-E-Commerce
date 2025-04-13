import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserPrivileges } from "../services/userService";

const PrivilegeSync = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role === "customer") {
      // Ensure privileges are correctly synced after registration
      updateUserPrivileges(user.user_id, {
        shopping: { isGranted: true },
        transactionAccess: { isGranted: true },
      });
    }
  }, [user, isAuthenticated]);

  return null; // No UI needed, just keeps privileges updated in the background
};

export default PrivilegeSync;
