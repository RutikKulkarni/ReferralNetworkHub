import React, { useState, useEffect } from "react";
import { getTheme, setTheme } from "../../utility/themeUtils";

export const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getTheme());

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    setTheme(newTheme);
  };

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
