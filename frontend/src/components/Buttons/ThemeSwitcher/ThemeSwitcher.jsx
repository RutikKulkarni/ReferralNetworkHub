import React, { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeProvider/ThemeProvider";
import styles from "./ThemeSwitcher.module.css";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

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
