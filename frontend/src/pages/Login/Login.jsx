import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import axios from "axios";
import { Config } from "../../App";
import { LinearProgress } from "@mui/material";
import { validateUserData } from "../../utility/validateUserInput";
import { persistUser } from "../../utility/userPersistence";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuAtSign } from "react-icons/lu";
import { GoLock } from "react-icons/go";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa6";

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
      const validation = validateUserData(userData);
      if (validation !== true) {
        toast.warning(validation);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      let response = await axios.post(`${Config.endpoint}auth/login`, userData);

      if (response.status === 200) {
        setIsLoading(false);
        toast.success(response.data.message);
      }

      if (rememberMe) {
        persistUser(
          response.data.user._id,
          response.data.token.token,
          "rememberMe"
        );
      } else {
        persistUser(response.data.user._id, response.data.token.token, "none");
      }

      setUserData({ email: "", password: "" });
      navigate("/");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 500) {
          toast.error(err.response.data.message);
        } else {
          toast.error(err.response.statusText);
        }
      } else {
        toast.error("An unexpected error occurred.");//snackbar
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
            <LuAtSign className={styles.mailIcon} />
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
            <GoLock className={styles.icon} />
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
              <FcGoogle className={styles.icon} />
            </button>
            <button className={styles.btn} disabled>
              <FaLinkedinIn className={styles.linkedInIcon} />
            </button>
          </div>
        </form>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Login;
