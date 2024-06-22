import React, { useContext } from "react";
import { MdOutlineLightMode } from "react-icons/md";
import { SlScreenDesktop } from "react-icons/sl";
import { BiMoon } from "react-icons/bi";
import { ThemeContext } from "../../../context/ThemeProvider/ThemeProvider";
import { getDeviceTheme } from "../../../utility/themeUtils";
import styles from "./ThemeSwitcher.module.css";

const ToggleThemeSwitcher = () => {
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

const ThemeSwitcher = () => {
  const { theme, setThemeExplicitly } = useContext(ThemeContext);

  const handleThemeChange = (newTheme) => {
    setThemeExplicitly(newTheme);
  };

  return (
    <div role="radiogroup" className={styles.themeSwitcher}>
      <button
        type="button"
        role="radio"
        data-theme-switcher="true"
        data-active={theme === "light"}
        className={styles.themeSwitcherSwitch}
        aria-label="Switch to light theme"
        aria-checked={theme === "light"}
        onClick={() => handleThemeChange("light")}
        title="Light"
      >
        <MdOutlineLightMode className="icon" />
      </button>
      <button
        type="button"
        role="radio"
        data-theme-switcher="true"
        data-active={theme === "system"}
        className={styles.themeSwitcherSwitch}
        aria-label="Switch to system theme"
        aria-checked={theme === "system"}
        onClick={() => handleThemeChange(getDeviceTheme())}
        title="System"
      >
        <SlScreenDesktop className="icon" />
      </button>
      <button
        type="button"
        role="radio"
        data-theme-switcher="true"
        data-active={theme === "dark"}
        className={styles.themeSwitcherSwitch}
        aria-label="Switch to dark theme"
        aria-checked={theme === "dark"}
        onClick={() => handleThemeChange("dark")}
        title="Dark"
      >
        <BiMoon className="icon" />
      </button>
    </div>
  );
};

export { ToggleThemeSwitcher, ThemeSwitcher };
