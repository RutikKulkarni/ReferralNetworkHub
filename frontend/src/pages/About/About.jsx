import React from "react";
import styles from "./About.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

/**
 * About component representing the About Us page.
 * @returns {JSX.Element} About JSX element
 */
const About = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.aboutContainer}>
        <h1>About Us</h1>
        <p>This is About Page</p>
      </div>
      <Footer />
    </div>
  );
};

export default About;
