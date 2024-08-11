import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import { userStyles as styles, BiUser, FiLogOut, HiOutlineLightBulb, LuLifeBuoy, ToggleThemeSwitcher, UserSvg, clearUserData, fetchUserData } from './imports';

const Widget = React.forwardRef((props, ref) => {
  const { userData, setUserData } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadUserData = async () => {
      const data = await fetchUserData();
      if (data) {
        setUserData({
          firstName: data.firstName || '',
          location: data.location || '',
        });
      }
    };
    loadUserData();
  }, [setUserData]);

  const handleLogout = () => {
    clearUserData();
    navigate('/login');
    props.closeWidget();
  };

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
          <h2 className={styles.profileName}>{userData.firstName || 'Name'}</h2>
          <p className={styles.profileLocation}>{userData.location || 'Location'}</p>
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
