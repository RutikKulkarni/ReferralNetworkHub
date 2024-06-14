import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./MyAccount.module.css";
import Form from "../../components/Form/Form";

/**
 * Home component representing the Home page.
 * @returns {JSX.Element} Home JSX element
 */
const MyAccount = () => {
  return (
    <div>
      <Navbar />
      <Form />
      <Footer />
    </div>
  );
};

export default MyAccount;
