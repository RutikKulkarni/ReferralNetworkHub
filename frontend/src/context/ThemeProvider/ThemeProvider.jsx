import React, { useState, useEffect } from "react";
import { getTheme, setTheme, getDeviceTheme } from "../../utility/themeUtils";

export const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getTheme());

  useEffect(() => {
    setTheme(theme);

    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

    const handleThemeChange = (e) => {
      const newTheme = e.matches ? "dark" : "light";
      setThemeState(newTheme);
      setTheme(newTheme);
    };

    darkThemeMq.addEventListener("change", handleThemeChange);

    return () => {
      darkThemeMq.removeEventListener("change", handleThemeChange);
    };
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    setTheme(newTheme);
  };

  const setThemeExplicitly = (newTheme) => {
    setThemeState(newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeExplicitly }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
