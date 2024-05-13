import { useState } from "react";
import navLogo from "../../assets/logo.svg";
import styles from "./Navbar.module.css";

function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className={`${styles.navbar}`}>
      <div className={`${styles.logo}`}>
        <img src={navLogo} alt="Logo" />
      </div>
      <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
        <li>Home</li>
        <li>About</li>
        <li>Services</li>
        <li>Help</li>
        <li>Contact</li>
      </ul>
      <div className={styles.navigations}>
        <div className={styles.navBtns}>
          <button className={`${styles.loginBtn}`}>Login</button>
          <button className={`${styles.signupBtn}`}>Sign Up</button>
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
