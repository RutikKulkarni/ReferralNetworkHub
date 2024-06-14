import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./MyAccount.module.css";

/**
 * Home component representing the Home page.
 * @returns {JSX.Element} Home JSX element
 */
const MyAccount = () => {
  const navigate = useNavigate();
  const handleEditAccountInfo = () => {
    navigate("/EditAccountInfo");
  };
  return (
    <div>
      <Navbar />
        <button onClick={handleEditAccountInfo} style={{ display: 'block', margin: '10px auto' }}>EDIT</button>
      <Footer />
    </div>
  );
};

export default MyAccount;
