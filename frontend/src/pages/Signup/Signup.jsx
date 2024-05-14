import React, { useState } from "react";
import styles from "./Signup.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { OutlinedInput, IconButton, Button } from "@mui/material";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { ReactComponent as LinkedInIcon } from "../../assets/linkedIn.svg";
import { ReactComponent as GoogleIcon } from "../../assets/google.svg";

/**
 * Signup component representing the Sign Up page.
 * @returns {JSX.Element} Signup JSX element
 */
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });

  // Function to toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // Function to handle input changes
  const handleOnChange = (e, type) => {
    setUserData((prev) => ({
      ...prev,
      [type]: e.target.value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setUserData({ email: "", password: "" });
    console.log("Submitted");
  };

  return (
    <div>
      <Navbar />
      <div className={styles.signUpWrapper}>
        <form className={styles.signUpForm} onSubmit={handleSubmit}>
          <h1 className={styles.signUp}>Sign Up</h1>
          <div className={styles.email}>
            <p>Email</p>
            <OutlinedInput
              type="email"
              required
              onChange={(e) => handleOnChange(e, "email")}
              value={userData.email}
              fullWidth
            />
          </div>
          <div className={styles.password}>
            <p>Password</p>
            <OutlinedInput
              required
              fullWidth
              value={userData.password}
              onChange={(e) => handleOnChange(e, "password")}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </IconButton>
              }
            />
          </div>

          <div className={styles.continue}>
            <button>Continue</button>
          </div>
        </form>

        <div className={styles.orLines}>
          <span className={styles.line}></span>
          <span className={styles.or}>OR</span>
          <span className={styles.line}></span>
        </div>

        <div className={styles.signUpAnotherWay}>
          <Button
            variant="outlined"
            startIcon={<LinkedInIcon />}
            className={styles.linkedIn}
          >
            Continue With LinkedIn
          </Button>

          <Button
            variant="outlined"
            startIcon={<GoogleIcon />}
            className={styles.linkedIn}
          >
            Continue With Google
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
