// This file contains all Imports for Signup Dir

// Common || GLobal imports
export { useState } from "react";
export { Link } from "react-router-dom";
export { useNavigate } from "react-router-dom";
export { registerUser } from "../SignupHelperFunctions";
export { default as axios } from "axios";
export {
  handleChange,
  validateUserData,
  generateSnackbar,
  catchError,
} from "../../../utility/exports";

// For ../Signup.jsx
export { default as signupStyles } from "../Signup.module.css";
export { LuAtSign } from "react-icons/lu";
export { GoLock } from "react-icons/go";
export { FcGoogle } from "react-icons/fc";
export { FaLinkedinIn } from "react-icons/fa6";
export { FiUser } from "react-icons/fi";
export { default as LinearProgress } from "@mui/material/LinearProgress";

// For ../SignupHelperFunction.js
// export { Config } from "../../../App";
