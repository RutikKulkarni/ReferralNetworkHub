import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import emailIcon from "../../assets/svg/email.svg";
import passwordIcon from "../../assets/svg/password.svg";
import googleIcon from "../../assets/svg/google.svg";
import linkedInIcon from "../../assets/svg/linkedIn.svg";
import axios from "axios";
import { Config } from "../../App";
import { LinearProgress } from "@mui/material";
import { validateUserData } from "../../utility/validateUserInput";
import { persistUser } from "../../utility/userPersistence";
import { generateSnackbar } from "../../utility/snackbarGenerator";

/**
 * Login component representing the Login page.
 * @returns {JSX.Element} Login JSX element
 */
const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const loginUser = async () => {
    try {
      if (validateUserData(userData) === true) {
        setIsLoading(true);
        let response = await axios.post(
          `${Config.endpoint}auth/login`,
          userData
        );

        if (response.status === 200) {
          setIsLoading(false);
          generateSnackbar(response.data.message, "success", 2000);
        }

        if (rememberMe) {
          persistUser(
            response.data.user._id,
            response.data.token.token,
            "rememberMe"
          );
        } else {
          persistUser(
            response.data.user._id,
            response.data.token.token,
            "none"
          );
        }

        setUserData({ email: "", password: "" });
        navigate("/");
      } else {
        generateSnackbar(validateUserData(userData), "warning", 2000);
      }
    } catch (err) {
      if (err.response?.status === 500) {
        generateSnackbar(err.response.data.message, "error", 2000);
      } else {
        generateSnackbar(err.response.statusText, "error", 2000);
      }

      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  const hanldeRememberMe = () => setRememberMe(!rememberMe);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.loginFormContainer}>
        <h1 className={styles.formTitle}>Login</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.flexColumn}>
            <label>Email</label>
          </div>
          <div className={styles.inputForm}>
            <img src={emailIcon} alt="Email Icon" className={styles.icon} />
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your Email"
              name="email"
              value={userData.email}
              onChange={handleChange}
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
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.flexRow}>
            <div>
              <input
                type="checkbox"
                id="rememberMe"
                value={rememberMe}
                onChange={hanldeRememberMe}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <span className={styles.span}>Forgot password?</span>
          </div>
          {isLoading && (
            <div style={{ marginTop: "10px" }}>
              <LinearProgress color="success" />
            </div>
          )}
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

export default Login;
