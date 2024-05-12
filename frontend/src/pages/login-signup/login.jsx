import React from "react";
import styles from "./login-signup.module.css";

const Login = () => {
  return (
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
  );
};

export default Login;
