import React from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { LuAtSign } from "react-icons/lu";
import { GoLock } from "react-icons/go";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa6";

/**
 * Login component representing the Login page.
 * @returns {JSX.Element} Login JSX element
 */
const Login = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.loginFormContainer}>
        <h1 className={styles.formTitle}>Login</h1>
        <form className={styles.form}>
          <div className={styles.flexColumn}>
            <label>Email</label>
          </div>
          <div className={styles.inputForm}>
            <LuAtSign className={styles.mailIcon}/>
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your Email"
              required
            />
          </div>

          <div className={styles.flexColumn}>
            <label>Password</label>
          </div>
          <div className={styles.inputForm}>
            <GoLock className={styles.icon}/>
            <input
              type="password"
              className={styles.input}
              placeholder="Enter your Password"
              required
            />
          </div>

          <div className={styles.flexRow}>
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <span className={styles.span}>Forgot password?</span>
          </div>
          <button className={styles.buttonSubmit}>Log In</button>
          <p className={styles.p}>
            Don't have an account?{" "}
            <Link to="/signup" className={styles.link}>
              Sign Up
            </Link>
          </p>
          <p className={`${styles.p} ${styles.line}`}>Or With</p>
          <div className={styles.flexRow}>
            <button className={styles.btn} disabled>
            <FcGoogle className={styles.icon}/>
            </button>
            <button className={styles.btn} disabled>
            <FaLinkedinIn className={styles.linkedInIcon}/>
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
