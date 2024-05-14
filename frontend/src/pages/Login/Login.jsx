import React, { useState } from "react";
import styles from "./Login.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { OutlinedInput, IconButton, Button } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { ReactComponent as LinkedInIcon } from "../../assets/linkedIn.svg";
import { ReactComponent as GoogleIcon } from "../../assets/google.svg";

/**
 * Signup component representing the Login page.
 * @returns {JSX.Element} Login JSX element
 */
const Login = () => {
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
      <div className={styles.loginWrapper}>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <h1 className={styles.login}>Login</h1>
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
              fullWidth
              required
              value={userData.password}
              onChange={(e) => handleOnChange(e, "password")}
              type={showPassword ? "text" : "password"}
              endAdornment={
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
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

        <div className={styles.loginAnotherWay}>
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

export default Login;
