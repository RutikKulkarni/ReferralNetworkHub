import React from "react";
import { IoLogoGithub } from "react-icons/io";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.alignment}>
          <h1>Referral Network</h1>
          <a
            href="https://github.com/RutikKulkarni/ReferralNetworkHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <IoLogoGithub style={{ width: "30px", height: "30px" }} />
          </a>
        </div>
        <hr />
        <div className={styles.alignment}>
          <p>&copy; 2024 Referral Network, All rights reserved.</p>
          <ul className={styles.footerLinks}>
            <li>
              <a href="#">Home</a>
            </li>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
