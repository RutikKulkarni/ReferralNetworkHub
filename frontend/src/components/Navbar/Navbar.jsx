import { useState } from "react";
import { Link } from "react-router-dom";
import navLogo from "../../assets/logo.svg";
import styles from "./Navbar.module.css";

function Navbar() {
  const [isActive, setIsActive] = useState(false);
  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };
  const removeActive = () => {
    setIsActive(false);
  };
  return (
    <div className="App">
      <header className="App-header">
        <nav className={`${styles.navbar}`}>
          {/* <a href='#home' className={`${styles.logo}`}>Referral Network </a> */}
          <img src={navLogo} className={`${styles.logo}`} alt="Logo" />
          <ul className={`${styles.navMenu} ${isActive ? styles.active : ""}`}>
            <li>
              <a href="#Home" className={`${styles.navLink}`}>
                Home
              </a>
            </li>
            <li>
              <a href="#About" className={`${styles.navLink}`}>
                About
              </a>
            </li>
            <li>
              <a href="#About" className={`${styles.navLink}`}>
                Services
              </a>
            </li>
            <li>
              <a href="#Help" className={`${styles.navLink}`}>
                Help
              </a>
            </li>
            <li>
              <a href="#Contact" className={`${styles.navLink}`}>
                Contact
              </a>
            </li>
          </ul>

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
        </nav>
      </header>
    </div>
  );
}
export default Navbar;
