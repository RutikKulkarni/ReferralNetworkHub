import React, { useState } from "react";
import styles from "./MyAccount.module.css";
import Profile from "../../components/Profile/Profile";

/**
 * Home component representing the Home page.
 * @returns {JSX.Element} Home JSX element
 */
const MyAccount = () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

export default MyAccount;
