import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import BgComponent from "./components/BgComponent/BgComponent";
import './index.css';

const Layout = ({ children }) => {
  return (
    <div
    className="layoutWrapper"
    >
      <div className="bgCompWrapper">
        <BgComponent />
      </div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;