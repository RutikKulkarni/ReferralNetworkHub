import {
  joinNowStyles as styles,
  IoArrowForwardCircleOutline,
  useNavigate,
  handleNavigate,
} from "../imports";

const JoinNow = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    handleNavigate("login", navigate);
  };

  return (
    <button
      variant="contained"
      className={styles.joinButton}
      onClick={handleClick}
    >
      Join Now <IoArrowForwardCircleOutline className={styles.arrowIcon} />
    </button>
  );
};

export default JoinNow;
