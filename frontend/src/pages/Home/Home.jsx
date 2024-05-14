import React from "react";
import styles from "./Home.module.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Hero from "../../components/Hero/Hero";

/**
 * Home component representing the Home page.
 * @returns {JSX.Element} Home JSX element
 */
const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default Home;
