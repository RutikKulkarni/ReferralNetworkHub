import {formStyles as styles, ChipTextField} from '../imports'

const SkillsExpertise = ({ skillsExpertise, setSkillsExpertise }) => {
  return (
    <div className={styles.skillsInfo}>
      <h3>Skills and Expertise</h3>
      <div className={styles.inputRow}>
        <ChipTextField
          placeholder={"Key Skills"}
          inputName={"keySkills"}
          chips={skillsExpertise.keySkills}
          setChips={setSkillsExpertise}
        />
        <ChipTextField
          placeholder={"Certifications or Licenses"}
          inputName={"certificationsLicenses"}
          chips={skillsExpertise.certificationsLicenses}
          setChips={setSkillsExpertise}
        />
      </div>
    </div>
  );
};

export default SkillsExpertise;
