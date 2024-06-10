import React, { useState, useEffect } from "react";
import { setTheme, getTheme } from "../../../utility/themeUtils";
import { CiDark, CiLight } from "react-icons/ci";
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
    <div className={styles.themeSwitcher} onClick={toggleTheme}>
      {theme === "light" ? (
        <CiDark size={30} className={styles.icon} />
      ) : (
        <CiLight size={30} className={styles.icon} />
      )}
    </div>
  );
};

export default ThemeSwitcher;
