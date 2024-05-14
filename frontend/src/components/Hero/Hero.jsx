import HeroImg from "../../assets/hero.svg";
import styles from "./Hero.module.css";
import { IoArrowForwardCircleOutline } from "react-icons/io5";

/**
 * Hero component for the Referral Network app.
 * @returns {JSX.Element} Hero component JSX
 */
const Hero = () => {
  return (
    <div className={styles.heroWrapper}>
      <div className={styles.heroParent}>
        <img src={HeroImg} alt="Mobile Hero" className={styles.smallHero} />
        <div className={styles.textContent}>
          <p className={styles.textWelcome}>Welcome to</p>
          <p className={styles.textReferral}>Referral Network..!</p>
          <p className={styles.textInfo}>
            Connecting Professionals, Streamlining Referrals
          </p>
          <button variant="contained" className={styles.joinButton}>
            Join Now{" "}
            <IoArrowForwardCircleOutline
              size={"30px"}
              className={styles.arrowIcon}
            />
          </button>
        </div>
      </div>

      <div className={styles.heroImage}>
        <img src={HeroImg} alt="Hero" />
      </div>
    </div>
  );
};

export default Hero;
