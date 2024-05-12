import React from 'react';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Welcome to Our Website</h1>
        <p>Discover amazing things here!</p>
        <button className={styles.heroBtn}>Get Started</button>
      </div>
    </div>
  );
};

export default Home;