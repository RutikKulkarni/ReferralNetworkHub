import React from "react";
import styles from "./Login-Signup.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Login = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1>Login</h1>
        <form className={styles.form}>
          <input type="text" placeholder="Username" className={styles.input} />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
