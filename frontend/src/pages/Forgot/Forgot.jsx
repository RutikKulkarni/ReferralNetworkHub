import {
  forgotStyles as styles,
  useState,
  useEffect,
  LuAtSign,
  GoLock,
  LinearProgress,
  AiOutlineCheckCircle
} from './imports'

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setShowPasswordFields(true);
    }
  }, []);

  const handleEmailSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
    }, 2000);
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    console.log("Password change logic here...");
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginFormContainer}>
        <h1 className={styles.formTitle}>Forgot Password</h1>
        <form
          className={styles.form}
          onSubmit={emailSent ? handlePasswordSubmit : handleEmailSubmit}
        >
          {!emailSent && (
            <div className={styles.inputForm}>
              <LuAtSign className={styles.mailIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your Email"
                name="email"
                required
              />
            </div>
          )}

          {emailSent && (
            <div className={styles.successIcon}>
              <AiOutlineCheckCircle className={styles.checkIcon} />
              <p>Email sent successfully!</p>
            </div>
          )}

          {emailSent && showPasswordFields && (
            <>
              <div className={styles.flexColumn}>
                <label>New Password</label>
              </div>
              <div className={styles.inputForm}>
                <GoLock className={styles.icon} />
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Enter your New Password"
                  name="newPassword"
                  required
                />
              </div>
              <div className={styles.flexColumn}>
                <label>Confirm Password</label>
              </div>
              <div className={styles.inputForm}>
                <GoLock className={styles.icon} />
                <input
                  type="password"
                  className={styles.input}
                  placeholder="Confirm your New Password"
                  name="confirmPassword"
                  required
                />
              </div>
            </>
          )}

          {isLoading && (
            <div style={{ marginTop: "10px" }}>
              <LinearProgress color="success" />
            </div>
          )}

          {!emailSent && (
            <button type="submit" className={styles.buttonSubmit}>
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
