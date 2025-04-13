import { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useAuth } from "../context/AuthContext"; 
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { theme } = useContext(ThemeContext);
  const { user, isAuthenticated, logoutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
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

      {/* Nav Links */}
      <ul className={`${styles.navLinks} ${menuOpen ? styles.showMenu : styles.hideMenu}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>

      <div className={styles.actions}>
        <ThemeToggle />

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* User Avatar */}
            <img
              src={user?.picture || "/default-avatar.png"}
              alt="User Avatar"
              className={styles.avatar}
            />

            {/* Logout Button */}
            <button onClick={handleLogout} className={styles.authButton}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => navigate("/login")} className={styles.authButton}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;




`
import { useContext, useState } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { theme } = useContext(ThemeContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={\`\${styles.navbar} \${styles[theme]}\`}> //
      <div className={styles.logo}>
        <Link to="/">Q2-Commerce</Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Nav Links */}
      <ul className={\`\${styles.navLinks} \${menuOpen ? styles.showMenu : styles.hideMenu}\`}>  //
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/orders">Orders</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>

      <div className={styles.actions}>
        <ThemeToggle />
        <button className={styles.authButton}>Sign In</button>
      </div>
    </nav>
  );
};

export default Navbar;
`