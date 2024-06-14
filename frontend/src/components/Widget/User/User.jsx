import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./User.module.css";
import { ReactComponent as UserSvg } from "../../../assets/svg/user.svg";
import { BiUser } from "react-icons/bi";
import { LuLifeBuoy } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { ThemeContext } from "../../../context/ThemeProvider/ThemeProvider";
import ThemeSwitcher from "../../Buttons/ThemeSwitcher/ThemeSwitcher";

const Widget = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleMyAccount = () => {
    navigate("/MyAccount");
  };

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
      <div className={styles.menuItem} onClick={handleMyAccount}>
        <i className="fa fa-user"></i>
        <BiUser className={styles.icon} />
        <span>My Account</span>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.menuItem}>
        <HiOutlineLightBulb className={styles.themeIcon} />
        <span>Dark Theme</span>
        <ThemeSwitcher />
      </div>
      <div className={styles.menuItem}>
        <LuLifeBuoy className={styles.helpIcon} />
        <span>Help</span>
      </div>
      <div className={styles.menuItem} onClick={handleLogout}>
        <FiLogOut className={styles.logoutIcon} />
        <span>Log out</span>
      </div>
    </div>
  );
};

export default Widget;
