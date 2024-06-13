import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import navLogo from "../../assets/svg/logo.svg";
import styles from "./Navbar.module.css";
import { handleNavigate } from "../../utility/handleRedirections";
import { BiUser } from "react-icons/bi";
import { LiaInfoCircleSolid } from "react-icons/lia";
import Widget from "../../components/Widget/User/User";

/**
 * Navbar component for navigation within the application.
 * @returns {JSX.Element} Navbar JSX element
 */
function Navbar() {
  let navigate = useNavigate();
  let location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [activePath, setActivePath] = useState(location.pathname);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [isWidgetVisible, setIsWidgetVisible] = useState(false);

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
   * Toggles the visibility of the user widget.
   */
  const toggleWidgetVisibility = () => {
    setIsWidgetVisible(!isWidgetVisible);
  };

  return (
    <nav className={`${styles.navbar}`}>
      <div className={`${styles.logo}`}>
        <img src={navLogo} alt="Logo" />
      </div>
      <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
        <li
          className={activePath === "/" ? styles.active : ""}
          onClick={() => handleNavigate("home", navigate)}
        >
          Home
        </li>
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
          {isWidgetVisible && <Widget />}
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
