import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./User.module.css";
import { ReactComponent as UserSvg } from "../../../assets/svg/user.svg";
import { BiUser } from "react-icons/bi";
import { LuLifeBuoy } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { HiOutlineLightBulb } from "react-icons/hi";
import { ThemeContext } from "../../../context/ThemeProvider/ThemeProvider";
import { clearUserData } from "../../../utility/userPersistence";
import { ToggleThemeSwitcher } from "../../Buttons/ThemeSwitcher/ThemeSwitcher";

/**
 * User widget component displaying user information and actions.
 *
 * @param {object} props - Component props.
 * @param {React.Ref} ref - Reference to the DOM node of the widget.
 * @returns {JSX.Element} User widget JSX element.
 */
const Widget = React.forwardRef((props, ref) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  /**
   * Handles user logout action, clearing user data from local storage.
   */
  const handleLogout = () => {
    const loginType = localStorage.getItem("loginType");
    const retainEmailPassword = loginType === "rememberMe";
    clearUserData(retainEmailPassword);
    navigate("/login");
    props.closeWidget();
  };

  /**
   * Navigates to the user's account page.
   */
  const handleMyAccount = () => {
    navigate("/MyAccount");
    props.closeWidget();
  };

  return (
    <div className={styles.widgetContainer} ref={ref}>
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
        <BiUser className={styles.icon} />
        <span>My Account</span>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.menuItems}>
        <HiOutlineLightBulb className={styles.themeIcon} />
        <span>Dark Theme</span>
        <ToggleThemeSwitcher />
      </div>
      <div className={styles.menuItems}>
        <LuLifeBuoy className={styles.helpIcon} />
        <span>Help</span>
      </div>
      <div className={styles.menuItems} onClick={handleLogout}>
        <FiLogOut className={styles.logoutIcon} />
        <span>Log out</span>
      </div>
    </div>
  );
});

export default Widget;
