import React, { useState, useEffect } from "react";
import { setTheme, getTheme } from "../../../utility/themeUtils";
import styles from "./ThemeSwitcher.module.css";

const ThemeSwitcher = () => {
  const [theme, setThemeState] = useState(getTheme());

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
  };

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
      />
      <span className={styles.slider}></span>
    </label>
  );
};

export default ThemeSwitcher;
