import React from "react";
import styles from "./Page404.module.css";
import { Link } from "react-router-dom";
import NotFoundImage from "../../assets/svg/404.svg";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={NotFoundImage} alt="404 Not Found" className={styles.image} />
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Oops! Page not found</p>
        <p className={styles.description}>
          Sorry, the page you are looking for might be in another castle.
          <br></br>Please check the URL or go back to the home.
        </p>
        <Link to="/">
          <button variant="contained" className={styles.joinButton}>
            Go to Homepage{" "}
            <IoArrowForwardCircleOutline className={styles.arrowIcon} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
