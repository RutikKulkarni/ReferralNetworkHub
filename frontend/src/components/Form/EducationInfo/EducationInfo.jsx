import {formStyles as styles, handleChange} from '../imports'

const EducationInfo = ({ education, setEducation }) => {
  return (
    <div className={styles.educationInfo}>
      <h3>Education</h3>
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Highest Degree Attained"
          name="highestDegreeAttained"
          value={education.highestDegreeAttained}
          onChange={(e) => handleChange(e, setEducation)}
          className={styles.inputField}
        />
        <input
          type="text"
          placeholder="University/Institution Name"
          name="uniInsName"
          value={education.uniInsName}
          onChange={(e) => handleChange(e, setEducation)}
          className={styles.inputField}
        />
      </div>
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Field of Study"
          name="fieldOfStudy"
          value={education.fieldOfStudy}
          onChange={(e) => handleChange(e, setEducation)}
          className={styles.inputField}
        />
        <input
          type="number"
          placeholder="Graduation Year"
          name="graduationYear"
          value={education.graduationYear}
          onChange={(e) => handleChange(e, setEducation)}
          className={styles.inputField}
        />
      </div>
    </div>
  );
};

export default EducationInfo;
