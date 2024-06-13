import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Signup.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { LuAtSign } from "react-icons/lu";
import { GoLock } from "react-icons/go";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import axios from "axios";
import { Config } from "../../App";
import LinearProgress from "@mui/material/LinearProgress";
import { useNavigate } from "react-router-dom";
import { validateUserData } from "../../utility/validateUserInput";
import { generateSnackbar } from "../../utility/snackbarGenerator";

/**
 * Signup component representing the Signup page.
 * @returns {JSX.Element} Signup JSX element
 */
const Signup = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const signupUser = async () => {
    try {
      if (validateUserData(userData) === true) {
        setIsLoading(true);
        let response = await axios.post(
          `${Config.endpoint}auth/register`,
          userData
        );

        if (response.status === 201) {
          generateSnackbar(response.data.message, "success", 2000);
          setIsLoading(false);
          setUserData({ name: "", email: "", password: "" });
          navigate("/login");
        }
      } else {
        generateSnackbar(validateUserData(userData), "warning", 2000);
      }
    } catch (err) {
      if (err.response?.status === 500) {
        generateSnackbar(err.response?.data.message, "error", 2000);
      } else {
        generateSnackbar(err.response?.statusText, "error", 2000);
      }
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signupUser();
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.signupFormContainer}>
        <h1 className={styles.formTitle}>Sign Up</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.flexColumn}>
            <label>Name</label>
          </div>
          <div className={styles.inputForm}>
            <FiUser className={styles.user} />
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your Name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              required
            />
          </div>

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

          {/* <div className={styles.flexRow}>
            <div>
              <input type="checkbox" id="rememberMe" />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
          </div> */}
          {isLoading && (
            <div style={{ marginTop: "10px" }}>
              <LinearProgress color="success" />
            </div>
          )}
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
              <FcGoogle className={styles.icon} />
            </button>
            <button className={styles.btn} disabled>
              <FaLinkedinIn className={styles.linkedInIcon} />
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
