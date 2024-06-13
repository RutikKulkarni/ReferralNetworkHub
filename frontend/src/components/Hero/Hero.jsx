import HeroImg from "../../assets/svg/hero.svg";
import styles from "./Hero.module.css";
import JoinNow from "../Buttons/JoinNow/JoinNow";

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
          <JoinNow />
        </div>
      </div>

      <div className={styles.heroImage}>
        <img src={HeroImg} alt="Hero" />
      </div>
    </div>
  );
};

export default Hero;
