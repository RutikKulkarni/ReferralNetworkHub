import React from "react";
import { Link } from "react-router-dom";
import styles from "./Signup.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import emailIcon from "../../assets/svg/email.svg";
import passwordIcon from "../../assets/svg/password.svg";
import googleIcon from "../../assets/svg/google.svg";
import linkedInIcon from "../../assets/svg/linkedIn.svg";
import { FiUser } from "react-icons/fi";

/**
 * Signup component representing the Signup page.
 * @returns {JSX.Element} Signup JSX element
 */
const Signup = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.loginFormContainer}>
        <h1 className={styles.formTitle}>Sign Up</h1>
        <form className={styles.form}>
          <div className={styles.flexColumn}>
            <label>Name</label>
          </div>
          <div className={styles.inputForm}>
            <FiUser className={styles.user} />
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your Name"
              required
            />
          </div>

          <div className={styles.flexColumn}>
            <label>Email</label>
          </div>
          <div className={styles.inputForm}>
            <img src={emailIcon} alt="Email Icon" className={styles.icon} />
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
            <img
              src={passwordIcon}
              alt="Password Icon"
              className={styles.icon}
            />
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
          </div>
          <button className={styles.buttonSubmit}>Sign up</button>
          <p className={styles.p}>
            Already have an account?{" "}
            <Link to="/login" className={styles.link}>
              Login
            </Link>
          </p>
          <p className={`${styles.p} ${styles.line}`}>Or With</p>
          <div className={styles.flexRow}>
            <button className={styles.btn} disabled>
              <img src={googleIcon} alt="Google Icon" className={styles.icon} />
            </button>
            <button className={styles.btn} disabled>
              <img
                src={linkedInIcon}
                alt="LinkedIn Icon"
                className={styles.icon}
              />
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
