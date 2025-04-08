import { createContext, useState, useEffect } from "react";
import themeConfig from "../utils/themeConfig";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.style.setProperty("--bg-color", themeConfig[theme].background);
    document.documentElement.style.setProperty("--text-color", themeConfig[theme].text);
    document.documentElement.style.setProperty("--accent-color", themeConfig[theme].accent);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
