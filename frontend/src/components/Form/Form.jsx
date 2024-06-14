import React, { useState } from 'react';
import ResumeUpload from "../Buttons/ResumeUpload/ResumeUpload";
import styles from './Form.module.css';

const Form = () => {
  const [gender, setGender] = useState('');
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.imageSection}>
        <div className={styles.uploadImage}>
          <input type="file" />
        </div>
        <input className={styles.inputField} type="text" placeholder="LinkedIn Profile URL" />
        <input className={styles.inputField} type="text" placeholder="GitHub Profile URL (Optional)" />
        <input className={styles.inputField} type="text" placeholder="Website URL (Optional)" />
        <div className={styles.genderSelection}>
          <label>
            <input
              type="radio"
              value="Male"
              checked={gender === 'Male'}
              onChange={handleGenderChange}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              value="Female"
              checked={gender === 'Female'}
              onChange={handleGenderChange}
            />
            Female
          </label>
          <label>
            <input
              type="radio"
              value="Other"
              checked={gender === 'Other'}
              onChange={handleGenderChange}
            />
            Other
          </label>
        </div>
      </div>
      <div className={styles.formSection}>
        {/* <div className={styles.resumeUpload}>
          <label htmlFor="resumeUpload">Choose Resume or drag & drop it here</label>
          <input type="file" id="resumeUpload" className={styles.uploadInput} />
        </div> */}
        <ResumeUpload/>
        <form>
          <div className={styles.inputGroup}>
            <input className={styles.inputField} type="text" placeholder="Full Name" />
            <input className={styles.inputField} type="email" placeholder="Email" />
          </div>
          <div className={styles.inputGroup}>
            <input className={styles.inputField} type="text" placeholder="Location (City, Country)" />
            <input className={styles.inputField} type="text" placeholder="Phone Number" />
          </div>
          <div className={styles.inputGroup}>
            <label>
              <input type="radio" name="experience" value="Experienced" /> Experienced
            </label>
            <label>
              <input type="radio" name="experience" value="Fresher" /> Fresher
            </label>
          </div>
          <div className={styles.inputGroup}>
            <input className={styles.inputField} type="text" placeholder="Current Job Title" />
            <input className={styles.inputField} type="text" placeholder="Company Name" />
          </div>
          <div className={styles.inputGroup}>
            <input className={styles.inputField} type="text" placeholder="Industry" />
            <input className={styles.inputField} type="text" placeholder="Years of Experience" />
          </div>
          <div className={styles.inputGroup}>
            <input className={styles.inputField} type="text" placeholder="Highest Degree Attained" />
            <input className={styles.inputField} type="text" placeholder="University/Institution Name" />
          </div>
          <div className={styles.inputGroup}>
            <input className={styles.inputField} type="text" placeholder="Field of Study" />
            <input className={styles.inputField} type="text" placeholder="Graduation Year" />
          </div>
          <div className={styles.inputGroup}>
            <input className={styles.inputField} type="text" placeholder="Key Skills" />
            <input className={styles.inputField} type="text" placeholder="Certifications or Licenses" />
          </div>
          <div className={styles.inputGroup}>
            <label>
              Work History
              <div className={styles.workHistory}>
                <input className={styles.inputField} type="text" placeholder="Previous Job Title" />
                <input className={styles.inputField} type="text" placeholder="Company Name" />
                <input className={styles.inputField} type="text" placeholder="Employment Dates (eg., Jan 2020 To Dec 2023)" />
                <input className={styles.inputField} type="text" placeholder="Responsibilities and Achievements (Optional)" />
              </div>
            </label>
          </div>
          <div className={styles.inputGroup}>
            <textarea className={styles.inputField} placeholder="Personal Bio or Summary (in 200 Words Only)"></textarea>
          </div>
          <div className={styles.inputGroup}>
            <select className={styles.inputField}>
              <option>Availability for Referrals</option>
              <option value="available">Available</option>
              <option value="notAvailable">Not Available</option>
            </select>
            <input className={styles.inputField} type="text" placeholder="Job Preferences" />
          </div>
          <div className={styles.inputGroup}>
            <label>
              <input type="checkbox" /> Accept Terms & Conditions
            </label>
          </div>
          <button className={styles.submitButton} type="submit">Save</button>
        </form>
      </div>
    </div>
  );
};

export default Form;
