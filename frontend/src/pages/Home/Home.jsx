import React from "react";
import styles from "./Home.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Our Website</h1>
          <p>Discover amazing things here!</p>
          <button className={styles.heroBtn}>Get Started</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
