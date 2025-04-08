import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="theme-toggle">
      <button onClick={() => toggleTheme("dark")} className={theme === "dark" ? "active" : ""}>Dark</button>
      <button onClick={() => toggleTheme("grey")} className={theme === "grey" ? "active" : ""}>Grey</button>
      <button onClick={() => toggleTheme("light")} className={theme === "light" ? "active" : ""}>Light</button>
    </div>
  );
};

export default ThemeToggle;
