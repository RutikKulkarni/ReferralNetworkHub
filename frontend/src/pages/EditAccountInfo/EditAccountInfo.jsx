import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./EditAccountInfo.module.css";
import Form from "../../components/Form/Form";

/**
 * Home component representing the Home page.
 * @returns {JSX.Element} Home JSX element
 */
const EditAccountInfo = () => {
  return (
    <div>
      <Navbar />
      <Form />
      <Footer />
    </div>
  );
};

export default EditAccountInfo;
