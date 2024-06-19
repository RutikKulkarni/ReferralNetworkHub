import React, { useState } from "react";
import styles from "./Form.module.css";
import { ReactComponent as UserSvg } from "../../assets/svg/user.svg";
import ResumeUpload from "../Buttons/ResumeUpload/ResumeUpload";
import ProfessionalInfo from "./ProfessionalInfo/ProfessionalInfo";
import WorkHistory from "./WorkHistory/WorkHistory";

const Form = () => {
  const [selectedOption, setSelectedOption] = useState("Experienced");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.imageSection}>
          {/* <img src="path_to_default_avatar_image" alt="Profile" className={styles.profileImage} /> */}
          <div className={styles.uploadImage}>
            <UserSvg className={styles.userSvg} />
          </div>
          <button className={styles.uploadButton}>Upload Image</button>
          <div className={styles.socialLinks}>
            <input
              type="url"
              placeholder="LinkedIn Profile URL"
              className={styles.inputField}
            />
            <input
              type="url"
              placeholder="GitHub Profile URL (Optional)"
              className={styles.inputField}
            />
            <input
              type="url"
              placeholder="Website URL (Optional)"
              className={styles.inputField}
            />
          </div>
          <div className={styles.genderSection}>
            <label>
              <input type="radio" name="gender" value="male" /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" /> Female
            </label>
            <label>
              <input type="radio" name="gender" value="other" /> Other
            </label>
          </div>
        </div>

        <div className={styles.formSection}>
          {/* <input type="file" className={styles.fileInput} /> */}
          <ResumeUpload />
          <div className={styles.personalInfo}>
            <h3>Personal Information</h3>
            <div className={styles.inputRow}>
              <input
                type="text"
                placeholder="Full Name"
                className={styles.inputField}
              />
              <input
                type="email"
                placeholder="Email"
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputRow}>
              <input
                type="text"
                placeholder="Location (City, Country)"
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className={styles.inputField}
              />
            </div>
          </div>
          <ProfessionalInfo
            handleOptionClick={handleOptionClick}
            selectedOption={selectedOption}
          />
          <div className={styles.educationInfo}>
            <h3>Education</h3>
            <div className={styles.inputRow}>
              <input
                type="text"
                placeholder="Highest Degree Attained"
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="University/Institution Name"
                className={styles.inputField}
              />
            </div>
            <div className={styles.inputRow}>
              <input
                type="text"
                placeholder="Field of Study"
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Graduation Year"
                className={styles.inputField}
              />
            </div>
          </div>
          <div className={styles.skillsInfo}>
            <h3>Skills and Expertise</h3>
            <div className={styles.inputRow}>
              <input
                type="text"
                placeholder="Key Skills"
                className={styles.inputField}
              />
              <input
                type="text"
                placeholder="Certifications or Licenses"
                className={styles.inputField}
              />
            </div>
          </div>
          <WorkHistory isDisabled={selectedOption === "Fresher"} />
          <div className={styles.additionalInfo}>
            <h3>Additional Information</h3>
            <textarea
              placeholder="Personal Bio or Summary (in 200 Words Only)"
              className={styles.textArea}
            ></textarea>
          </div>
          <div className={styles.preferences}>
            <h3>Preferences</h3>
            <div className={styles.inputRow}>
              <select className={styles.selectField}>
                <option disabled selected>
                  Availability for Referrals
                </option>
                <option>I am able to provide referrals to others</option>
                <option>I am looking for referrals</option>
                <option>
                  I can both provide referrals in my current company and am
                  looking referrals
                </option>
              </select>
              <input
                type="text"
                placeholder="Job Preferences"
                className={styles.inputField}
              />
            </div>
          </div>
          <div className={styles.footerInputes}>
            <div className={styles.termsAndConditions}>
              <label>
                <input type="checkbox" /> Accept Terms & Conditions
              </label>
            </div>
            <button className={styles.saveButton}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
