import { joinNowStyles as styles, IoArrowForwardCircleOutline } from '../imports'

const JoinNow = () => {
  return (
    <button variant="contained" className={styles.joinButton}>
      Join Now{" "}
      <IoArrowForwardCircleOutline className={styles.arrowIcon} />
    </button>
  );
};

export default JoinNow;
