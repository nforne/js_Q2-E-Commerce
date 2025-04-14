import { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext"; 
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import avatar from "../assets/default-avatar.jpg";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { theme } = useContext(ThemeContext);
  const { user, setUser, isAuthenticated, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    await setUser(null);
    navigate("/home"); // Redirect to login/signup page after logout
  };

  return (
    <nav className={`${styles.navbar} ${styles[theme]}`}>
      <div className={styles.logo}>
        <Link to="/">Q2-Commerce</Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Navigation Links */}
      <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : styles.hideMenu}`}>
        <li><Link to="/">Home</Link></li>
        {isAuthenticated && <li><Link to="/products">Products</Link></li>}
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}
      </ul>

      <div className={styles.actions}>
        

        {isAuthenticated ? (
          // Show avatar and logout when the user is signed in
          <div className={styles.userSection}>
            <img
              src={user?.picture || avatar}
              alt="User-Avatar"
              className={styles.avatar}
            />
            <button onClick={handleLogout} className={styles.authButton}>
              Logout
            </button>
          </div>
        ) : (
          // Show "Start [Login/SignUp]" when user is not signed in
          <button onClick={() => navigate("/auth")} className={styles.authButton}>
            Start [Login/SignUp]
          </button>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
