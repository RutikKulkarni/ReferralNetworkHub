import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userStyles as styles, BiUser, FiLogOut, HiOutlineLightBulb, LuLifeBuoy, ThemeContext, ToggleThemeSwitcher, UserSvg, clearUserData, fetchUserData } from './imports/index'; // Ensure this path is correct

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
  const [userData, setUserData] = useState({ firstName: 'Name', location: 'Location' });

  useEffect(() => {
    const loadUserData = async () => {
      const data = await fetchUserData();
      if (data) {
        setUserData({
          firstName: data.firstName || 'Name',
          location: data.location || 'Location',
        });
      }
    };
    loadUserData();
  }, []);

  /**
   * Handles user logout action, clearing user data from local storage.
   */
  const handleLogout = () => {
    clearUserData();
    navigate('/login');
    props.closeWidget();
  };

  /**
   * Navigates to the user's account page.
   */
  const handleMyAccount = () => {
    navigate('/MyAccount');
    props.closeWidget();
  };

  return (
    <div className={styles.widgetContainer} ref={ref}>
      <div className={styles.profileSection}>
        <div className={styles.profileImage}>
          <UserSvg className={styles.userSvg} />
        </div>
        <div className={styles.profileDetails}>
          <h2 className={styles.profileName}>{userData.firstName}</h2>
          <p className={styles.profileLocation}>{userData.location}</p>
        </div>
      </div>
      <div className={styles.fullDivider}></div>
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
