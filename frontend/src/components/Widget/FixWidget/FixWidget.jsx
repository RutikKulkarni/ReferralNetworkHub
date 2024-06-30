import React from "react";
import { FaRocket } from "react-icons/fa";
import { PiRocketLaunch } from "react-icons/pi";
import styles from "./FixWidget.module.css";

const FixWidget = () => {
  const handleClick = () => {
    window.open("https://forms.gle/3xAT8V3JBenMygLB8", "_blank");
  };

  return (
    <>
      <div className={styles.widgetContainer} onClick={handleClick}>
        <div className={styles.widget}>
          <FaRocket className={styles.icon} />
        </div>
      </div>
      <div className={styles.widgetContainer}>
        <div className={styles.desktopWidget}>
          <p>
            Be the first to experience our latest updates!{" "}
            <span onClick={handleClick}>
              Sign up now for early access{" "}
              <PiRocketLaunch className={styles.blueIcon} />
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default FixWidget;
