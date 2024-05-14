import React from "react";
import { IoLogoGithub } from "react-icons/io";
import styles from "./Footer.module.css";
import { useNavigate } from "react-router-dom";

/**
 * Footer component for the Referral Network app.
 * @returns {JSX.Element} Footer component JSX
 */
const Footer = () => {
  let navigate = useNavigate();

  /**
   * Handle navigation based on the provided path.
   * @param {string} path - The path to navigate to (e.g., 'home', 'about', 'help', 'contact').
   */
  const handleNavigate = (path) => {
    const redirects = {
      home: "/",
      about: "/about",
      help: "/help",
      contact: "/contact",
    };

    navigate(redirects[path]);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.alignment}>
          <h1 className={styles.footerHeading}>Referral Network</h1>
          <a
            href="https://github.com/RutikKulkarni/ReferralNetworkHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoGithub style={{ width: "30px", height: "30px" }} />
          </a>
        </div>
        <hr />
        <div className={styles.alignment2}>
          <p>&copy; 2024 Referral Network, All rights reserved.</p>
          <ul className={styles.footerLinks}>
            <li onClick={() => handleNavigate("home")}>Home</li>
            <li onClick={() => handleNavigate("about")}>About</li>
            <li onClick={() => handleNavigate("help")}>Help</li>
            <li onClick={() => handleNavigate("contact")}>Contact</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
