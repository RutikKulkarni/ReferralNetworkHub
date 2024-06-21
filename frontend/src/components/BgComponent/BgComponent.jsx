import React from "react";
import styles from "./BgComponent.module.css";
import wavylines from "../../../src/assets/png/wavylines.png";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

const BgComponent = () => {
  return (
    <div className={styles.bg}>
      <div className={styles.skyBlueCircle}></div>
      <img src={wavylines} alt="Wavy Lines" className={styles.line1} />
      <img src={wavylines} alt="Wavy Lines" className={styles.line2} />
      <img src={wavylines} alt="Wavy Lines" className={styles.line3} />
      <div className={styles.yellowCircle}></div>
      <div className={styles.purpleCircle}></div>
      <div className={styles.redCircle}></div>
      <div className={styles.greenCircle}></div>
      <div className={styles.darkskyBlueCircle}></div>
      <div className={styles.BlueSquare}></div>
    </div>
  );
};

const BgLayout = (Component, useLayout = true) => {
  return (props) => {
    if (useLayout) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", zIndex: -99 }}>
            <BgComponent />
          </div>
          <Navbar />
          <main>
            <Component {...props} />
          </main>
          <Footer />
        </div>
      );
    }
    return <Component {...props} />;
  };
};

export { BgLayout };
export default BgComponent;
