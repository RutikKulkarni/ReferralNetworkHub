import {
  signupStyles as styles,
  useState,
  Link,
  LuAtSign,
  GoLock,
  FcGoogle,
  FaLinkedinIn,
  FiUser,
  LinearProgress,
  useNavigate,
  handleChange,
  registerUser
} from './imports'

/**
 * Signup component representing the Signup page.
 * @returns {JSX.Element} Signup JSX element
 */
const Signup = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the form submission for registering a new user.
   *
   * @param {Object} e - The event object from the form submission.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(userData, setIsLoading, setUserData, navigate);
  };

  return (
    <div className={styles.container}>
      <div className={styles.signupFormContainer}>
        <h1 className={styles.formTitle}>Sign Up</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.flexColumn}>
            <label>Name</label>
          </div>
          <div className={styles.inputForm}>
            <FiUser className={styles.icon} />
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your Name"
              name="name"
              value={userData.name}
              onChange={(event) => handleChange(event, setUserData)}
              required
            />
          </div>

          <div className={styles.flexColumn}>
            <label>Email</label>
          </div>
          <div className={styles.inputForm}>
            <LuAtSign className={styles.mailIcon} />
            <input
              type="text"
              className={styles.input}
              placeholder="Enter your Email"
              name="email"
              value={userData.email}
              onChange={(event) => handleChange(event, setUserData)}
              required
            />
          </div>

          <div className={styles.flexColumn}>
            <label>Password</label>
          </div>
          <div className={styles.inputForm}>
            <GoLock className={styles.icon} />
            <input
              type="password"
              className={styles.input}
              placeholder="Enter your Password"
              name="password"
              value={userData.password}
              onChange={(event) => handleChange(event, setUserData)}
              required
            />
          </div>
          {isLoading && (
            <div style={{ marginTop: "10px" }}>
              <LinearProgress color="success" />
            </div>
          )}
          <button className={styles.buttonSubmit}>Sign up</button>
          <p className={styles.p}>
            Already have an account?{" "}
            <Link to="/login" className={styles.link}>
              Login
            </Link>
          </p>
          <p className={`${styles.p} ${styles.line}`}>Or With</p>
          <div className={styles.flexRow}>
            <button className={styles.btn} disabled>
              <FcGoogle className={styles.GoogleIcon} />
            </button>
            <button className={styles.btn} disabled>
              <FaLinkedinIn className={styles.linkedInIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
