import React from "react";
import styles from "./Help.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

/**
 * Help component representing the Help page.
 * @returns {JSX.Element} Help JSX element
 */
const Help = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.help}>
        <h1>Help</h1>
        <p>This is Help Page</p>
      </div>
      <Footer />
    </div>
  );
};

export default Help;
