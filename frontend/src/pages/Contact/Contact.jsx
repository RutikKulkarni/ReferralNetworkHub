import React from "react";
import styles from "./Contact.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Contact = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.contactContainer}>
        <h1>Contact</h1>
        <p>This is Contact Page</p>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
