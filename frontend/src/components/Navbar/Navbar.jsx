import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import navLogo from "../../assets/svg/logo.svg";
import styles from "./Navbar.module.css";
// import ThemeSwitcher from "../Buttons/ThemeSwitcher/ThemeSwitcher";

/**
 * Navbar component for navigation within the application.
 * @returns {JSX.Element} Navbar JSX element
 */
function Navbar() {
  let navigate = useNavigate();
  let location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  /**
   * Toggles the active class for mobile menu.
   */
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  /**
   * Navigates to the specified path.
   * @param {string} path - Path to navigate to
   */
  const handleNavigate = (path) => {
    const redirects = {
      home: "/",
      about: "/about",
      services: "/services",
      help: "/help",
      contact: "/contact",
      login: "/login",
      signup: "/signup",
    };

    navigate(redirects[path]);
  };

  return (
    <nav className={`${styles.navbar}`}>
      <div className={`${styles.logo}`}>
        <img src={navLogo} alt="Logo" />
      </div>
      <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
        <li
          className={activePath === "/" ? styles.active : ""}
          onClick={() => handleNavigate("home")}
        >
          Home
        </li>
        <li
          className={activePath === "/about" ? styles.active : ""}
          onClick={() => handleNavigate("about")}
        >
          About
        </li>
        <li
          className={activePath === "/services" ? styles.active : ""}
          onClick={() => handleNavigate("services")}
        >
          Services
        </li>
        <li
          className={activePath === "/help" ? styles.active : ""}
          onClick={() => handleNavigate("help")}
        >
          Help
        </li>
        <li
          className={activePath === "/contact" ? styles.active : ""}
          onClick={() => handleNavigate("contact")}
        >
          Contact
        </li>
      </ul>
      <div className={styles.navigations}>
        <div className={styles.navBtns}>
          <button
            className={`${styles.loginBtn}`}
            onClick={() => handleNavigate("login")}
          >
            Login
          </button>
          <button
            className={`${styles.signupBtn}`}
            onClick={() => handleNavigate("signup")}
          >
            Sign Up
          </button>
          {/* <ThemeSwitcher /> */}
        </div>

        <div
          className={`${styles.hamburger} ${isActive ? styles.active : ""}`}
          onClick={toggleActiveClass}
        >
          <span className={`${styles.bar}`}></span>
          <span className={`${styles.bar}`}></span>
          <span className={`${styles.bar}`}></span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
