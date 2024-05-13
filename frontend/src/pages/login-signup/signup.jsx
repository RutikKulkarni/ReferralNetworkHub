import React from "react";
import styles from "./Login-Signup.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Signup = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1>Signup</h1>
        <form className={styles.form}>
          <input type="text" placeholder="Username" className={styles.input} />
          <input type="email" placeholder="Email" className={styles.input} />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Signup
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
