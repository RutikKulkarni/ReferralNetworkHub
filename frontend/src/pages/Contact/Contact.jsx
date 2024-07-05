import { contactStyles as styles } from './imports'

/**
 * Contact component representing the Contact page.
 * @returns {JSX.Element} Contact JSX element
 */
const Contact = () => {
  return (
    <div>
      <div className={styles.contactContainer}>
        <h1>Contact</h1>
        <p>This is Contact Page</p>
      </div>
    </div>
  );
};

export default Contact;
