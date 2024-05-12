import React from "react";
import styles from "./login-signup.module.css";

const Signup = () => {
  return (
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
  );
};

export default Signup;
