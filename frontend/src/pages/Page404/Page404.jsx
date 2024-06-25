import {
  notFoundStyles as styles,
  Link,
  NotFoundImage,
  IoArrowForwardCircleOutline
} from './imports'

const NotFound = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src={NotFoundImage} alt="404 Not Found" className={styles.image} />
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Oops! Page not found</p>
        <p className={styles.description}>
          Sorry, the page you are looking for might be in another castle.
          <br></br>Please check the URL or go back to the home.
        </p>
        <Link to="/">
          <button variant="contained" className={styles.joinButton}>
            Go to Homepage{" "}
            <IoArrowForwardCircleOutline className={styles.arrowIcon} />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
