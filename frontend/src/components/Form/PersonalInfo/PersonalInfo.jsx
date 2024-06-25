import {formStyles as styles, handleChange} from '../imports'

const PersonalInfo = ({ personalInfo, setPersonalInfo }) => {
  return (
    <div className={styles.personalInfo}>
      <h3>Personal Information</h3>
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Full Name"
          name="fullName"
          value={personalInfo.fullName}
          onChange={(e) => handleChange(e, setPersonalInfo)}
          className={styles.inputField}
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={personalInfo.email}
          onChange={(e) => handleChange(e, setPersonalInfo)}
          className={styles.inputField}
        />
      </div>
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Location (City, Country)"
          name="location"
          value={personalInfo.location}
          onChange={(e) => handleChange(e, setPersonalInfo)}
          className={styles.inputField}
        />
        <input
          type="number"
          placeholder="Phone Number"
          name="phoneNumber"
          value={personalInfo.phoneNumber}
          onChange={(e) => handleChange(e, setPersonalInfo)}
          className={styles.inputField}
        />
      </div>
    </div>
  );
};

export default PersonalInfo;
