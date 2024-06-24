import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import navDarklogo from "../../assets/svg/dark-logo.svg";
import navWhitelogo from "../../assets/svg/white-logo.svg";
import styles from "./Navbar.module.css";
import { handleNavigate } from "../../utility/handleRedirections";
import { BiUser } from "react-icons/bi";
import { LiaInfoCircleSolid } from "react-icons/lia";
import Widget from "../../components/Widget/User/User";
import { ThemeContext } from "../../context/ThemeProvider/ThemeProvider";

/**
 * Navbar component for navigation within the application.
 * @returns {JSX.Element} Navbar JSX element
 */
const Navbar = () => {
  const { theme } = useContext(ThemeContext);
  let navigate = useNavigate();
  let location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    setActivePath(location.pathname);
    // Update userId state when localStorage changes
    setUserId(localStorage.getItem("userId"));
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsWidgetVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Toggles the active class for mobile menu.
   */
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  /**
   * Toggles the visibility of the user widget.
   */
  const toggleWidgetVisibility = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };

  return (
    <nav className={`${styles.navbar}`}>
      <div className={`${styles.logo}`}>
        <img src={theme === "dark" ? navWhitelogo : navDarklogo} alt="Logo" />
      </div>
      <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
        {!userId ? (
          <>
            <li
              className={activePath === "/" ? styles.active : ""}
              onClick={() => handleNavigate("home", navigate)}
            >
              Home
            </li>
          </>
        ) : (
          <>
            <li
              className={activePath === "/explore" ? styles.active : ""}
              onClick={() => handleNavigate("home", navigate)}
            >
              Explore
            </li>
          </>
        )}
        <li
          className={activePath === "/about" ? styles.active : ""}
          onClick={() => handleNavigate("about", navigate)}
        >
          About
        </li>
        <li
          className={activePath === "/services" ? styles.active : ""}
          onClick={() => handleNavigate("services", navigate)}
        >
          Services
        </li>
        <li
          className={activePath === "/help" ? styles.active : ""}
          onClick={() => handleNavigate("help", navigate)}
        >
          Help
        </li>
        <li
          className={activePath === "/contact" ? styles.active : ""}
          onClick={() => handleNavigate("contact", navigate)}
        >
          Contact
        </li>
      </ul>
      <div className={styles.navigations}>
        <div className={styles.navBtns}>
          {!userId ? (
            <>
              <button
                className={`${styles.loginBtn}`}
                onClick={() => handleNavigate("login", navigate)}
              >
                Login
              </button>
              <button
                className={`${styles.signupBtn}`}
                onClick={() => handleNavigate("signup", navigate)}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <BiUser
                className={styles.iconUser}
                onClick={toggleWidgetVisibility}
              />
              <LiaInfoCircleSolid className={styles.iconInfo} />
            </>
          )}
          {isWidgetVisible && (
            <Widget
              ref={widgetRef}
              closeWidget={() => setIsWidgetVisible(false)}
            />
          )}
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
};

export default Navbar;
