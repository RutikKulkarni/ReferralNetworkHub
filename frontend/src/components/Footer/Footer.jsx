import {footerStyles as styles, useNavigate, SiGithub, ThemeSwitcher} from './imports'

/**
 * Footer component for the Referral Network app.
 * @returns {JSX.Element} Footer component JSX
 */
const Footer = () => {
  let navigate = useNavigate();

  /**
   * Handle navigation based on the provided path.
   * @param {string} path - The path to navigate to (e.g., 'home', 'about', 'help', 'contact').
   */
  const handleNavigate = (path) => {
    const redirects = {
      home: "/",
      about: "/about",
      help: "/help",
      contact: "/contact",
    };

    navigate(redirects[path]);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.alignment}>
          <h1 className={styles.footerHeading}>Referral Network</h1>
          <a
            href="https://github.com/RutikKulkarni/ReferralNetworkHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithub className={styles.gitLogo} />
          </a>
        </div>
        <hr />
        <div className={styles.alignment}>
          <p>&copy; 2024 Referral Network, All rights reserved.</p>
          <div>
          <ThemeSwitcher className={styles.gitLogo}/>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
