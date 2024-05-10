import navbarLogo from "../../assets/logo.svg";
import { Button } from "@mui/material";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <img src={navbarLogo} alt="Navbar Logo" />
      </div>

      <ul className={styles.navLinks}>
        <li>Home</li>
        <li>About</li>
        <li>Services</li>
        <li>Review</li>
        <li>Help</li>
        <li>Contact</li>
      </ul>

      <div className={styles.redirectBtns}>
        <Button variant="outlined" size="large" className={styles.login}>
          Login
        </Button>
        <Button variant="contained" size="large" className={styles.signup}>
          Signup
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
