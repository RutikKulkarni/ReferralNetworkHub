import { useState } from "react";
import navLogo from "../../assets/logo.svg";
import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  let navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

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
        <li onClick={() => handleNavigate("home")}>Home</li>
        <li onClick={() => handleNavigate("about")}>About</li>
        <li onClick={() => handleNavigate("services")}>Services</li>
        <li onClick={() => handleNavigate("help")}>Help</li>
        <li onClick={() => handleNavigate("contact")}>Contact</li>
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
