import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import styles from "../styles/ThemeToggle.module.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Handle cycling through themes
  const handleThemeChange = () => {
    const nextTheme = theme === "dark" ? "grey" : theme === "grey" ? "light" : "dark";
    toggleTheme(nextTheme);
  };

  // Determine the icon based on the current theme
  const getIcon = () => {
    if (theme === "dark") return "🌙"; // Moon icon for dark mode
    if (theme === "grey") return "⭐"; // Star icon for grey mode
    if (theme === "light") return "☀️"; // Sun icon for light mode
    return "🌙"; // Default icon
  };

  return (
    <button
      className={`${styles.toggleButton} ${styles[theme]}`}
      onClick={handleThemeChange}
      aria-label={`Switch to ${theme === "dark" ? "grey" : theme === "grey" ? "light" : "dark"} mode`}
    >
      {getIcon()}
    </button>
  );
};

export default ThemeToggle;
