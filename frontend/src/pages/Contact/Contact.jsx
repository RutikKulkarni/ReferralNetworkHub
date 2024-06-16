import React from "react";
import styles from "./Contact.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

/**
 * Contact component representing the Contact page.
 * @returns {JSX.Element} Contact JSX element
 */
const Contact = () => {
  return (
    <div>
      <div className={styles.contactContainer}>
        <h1>Contact</h1>
        <p>This is Contact Page</p>
      </div>
    </div>
  );
};

export default Contact;
