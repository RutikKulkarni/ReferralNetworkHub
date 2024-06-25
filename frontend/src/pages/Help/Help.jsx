import { helpStyles as styles } from './imports'

/**
 * Help component representing the Help page.
 * @returns {JSX.Element} Help JSX element
 */
const Help = () => {
  return (
    <div>
      <div className={styles.help}>
        <h1>Help</h1>
        <p>This is Help Page</p>
      </div>
    </div>
  );
};

export default Help;
