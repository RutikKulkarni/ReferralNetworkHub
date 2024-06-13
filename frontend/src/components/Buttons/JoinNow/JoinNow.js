import React from "react";
import styles from "./JoinNow.module.css";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

const JoinNow = () => {
  return (
    <button variant="contained" className={styles.joinButton}>
      Join Now{" "}
      <IoArrowForwardCircleOutline className={styles.arrowIcon} />
    </button>
  );
};

export default JoinNow;
