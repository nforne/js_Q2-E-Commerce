import { useAuth } from "../context/AuthContext";

/**
 * UI wrapper that only renders child components if the user has the required privilege.
 */
const PrivilegeGuard = ({ privilege, children }) => {
  const { user, isAuthenticated } = useAuth();

  // Check if user has the required privilege
  const hasAccess = isAuthenticated && user?.privileges?.[privilege]?.isGranted;

  return hasAccess ? children : null;
};

export default PrivilegeGuard;
