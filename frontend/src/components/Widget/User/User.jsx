import React from "react";
import styles from "./User.module.css";
// import userSvg from '../../../assets/svg/user.svg'
import { ReactComponent as UserSvg } from "../../../assets/svg/user.svg";
import { BiUser } from "react-icons/bi";
import { LuLifeBuoy } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";

const Widget = () => {
  return (
    <div className={styles.widgetContainer}>
      <div className={styles.profileSection}>
        <div className={styles.profileImage}>
          <UserSvg className={styles.userSvg} />
        </div>
        <div className={styles.profileDetails}>
          <h2 className={styles.profileName}>Name</h2>
          <p className={styles.profileLocation}>Pune, Maharashtra</p>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.menuItem}>
        <i className="fa fa-user"></i>
        <BiUser className={styles.icon} />
        <span>My Account</span>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.menuItem}>
        <HiOutlineLightBulb className={styles.themeIcon} />
        <span>Dark Theme</span>
        <label className={styles.switch}>
          <input type="checkbox" checked />
          <span className={styles.slider}></span>
        </label>
      </div>
      <div className={styles.menuItem}>
        <LuLifeBuoy className={styles.helpIcon} />
        <span>Help</span>
      </div>
      <div className={styles.menuItem}>
        <FiLogOut className={styles.logoutIcon} />
        <span>Log out</span>
      </div>
    </div>
  );
};

export default Widget;
