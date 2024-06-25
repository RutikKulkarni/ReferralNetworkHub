import {heroStyles as styles, HeroImg, JoinNow} from './imports'

const Hero = () => {
  return (
    <>
      <div className={styles.heroContainer}>
        <div>
          <div className={styles.textContainer}>
            <h1>Welcome to</h1>
            <h1>
              <b>Referral Network..!</b>
            </h1>
            <p>Connecting Professionals, Streamlining Referrals </p>
            <JoinNow />
          </div>
        </div>
        <div className={styles.imageContainer}>
          <img src={HeroImg} alt="Hero" />
        </div>
      </div>
    </>
  );
};

export default Hero;
