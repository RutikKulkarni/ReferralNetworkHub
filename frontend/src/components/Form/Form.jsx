import React, { useState } from "react";
import styles from "./Form.module.css";
import Preferences from "./Preferences/Preferences";
import ResumeUpload from "../Buttons/ResumeUpload/ResumeUpload";
import ImageSection from "./ImageSection/ImageSection";
import ProfessionalInfo from "./ProfessionalInfo/ProfessionalInfo";
import WorkHistory from "./WorkHistory/WorkHistory";
import PersonalInfo from "./PersonalInfo/PersonalInfo";
import EducationInfo from "./EducationInfo/EducationInfo";
import SkillsExpertise from "./SkillsExpertise/SkillsExpertise";
import AdditionalInfo from "./AdditionalInfo/AdditionalInfo";
import { resetStates, updateUserAccountInfo } from "./formHelperFunc";
import { useNavigate } from "react-router-dom";
import { generateSnackbar } from "../../utility/snackbarGenerator";

const Form = () => {
  const [selectedOption, setSelectedOption] = useState("Experienced");
  const navigate = useNavigate();
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    email: "",
    gender: "",
    resume: " ",
    location: "",
    phoneNumber: "",
    profilePhoto: " ",
  });
  const [professionalInfo, setProfessionalInfo] = useState({
    currentJobTitle: "",
    companyName: "",
    industry: "",
    yearsOfExperience: "",
  });
  const [education, setEducation] = useState({
    highestDegreeAttained: "",
    uniInsName: "",
    fieldOfStudy: "",
    graduationYear: "",
  });
  const [skillsExpertise, setSkillsExpertise] = useState({
    keySkills: [],
    certificationsLicenses: [],
  });
  const [workHistory, setWorkHistory] = useState([
    {
      previousJobTitle: "",
      companyName: "",
      employmentDates: "",
      responsibilitiesAchievements: "",
    },
  ]);
  const [preferences, setPreferences] = useState({
    availabilityForReferrals: "",
    jobPreferences: [],
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    personalBio: "",
  });
  const [socialLinks, setSocialLinks] = useState({
    linkedInUrl: "",
    gitHubUrl: "",
    websiteUrl: "",
  });
  const [termsAndConditions, setTermsAndConditions] = useState(false)

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!termsAndConditions){
      generateSnackbar("You must have checked Terms & Conditions Box!", 'warning', 2000)
      return;
    }

    let data = {
      personalInfo,
      professionalInfo,
      education,
      skillsExpertise,
      workHistory,
      preferences,
      additionalInfo,
      socialLinks,
    };
    updateUserAccountInfo(data, navigate);

    resetStates(
      setPersonalInfo,
      setProfessionalInfo,
      setEducation,
      setSkillsExpertise,
      setWorkHistory,
      setPreferences,
      setAdditionalInfo,
      setSocialLinks
    );
  };

  return (
    <div className={styles.pageContainer}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <ImageSection
          setProfileInfo={setPersonalInfo}
          socialLinks={socialLinks}
          setSocialLinks={setSocialLinks}
        />
        <div className={styles.formSection}>
          <ResumeUpload setResume={setPersonalInfo} />
          <PersonalInfo
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
          />
          <ProfessionalInfo
            handleOptionClick={handleOptionClick}
            selectedOption={selectedOption}
            professionalInfo={professionalInfo}
            setProfessionalInfo={setProfessionalInfo}
          />
          <EducationInfo education={education} setEducation={setEducation} />
          <SkillsExpertise
            skillsExpertise={skillsExpertise}
            setSkillsExpertise={setSkillsExpertise}
          />
          <WorkHistory
            isDisabled={selectedOption === "Fresher"}
            workHistoryFields={workHistory}
            setWorkHistoryFields={setWorkHistory}
          />
          <Preferences
            preferences={preferences}
            setPreferences={setPreferences}
          />
          <AdditionalInfo
            additionalInfo={additionalInfo}
            setAdditionalInfo={setAdditionalInfo}
          />
          <div className={styles.footerInputes}>
            <div className={styles.termsAndConditions}>
              <label>
                <input type="checkbox" value="termsAndConditions" checked={termsAndConditions} onChange={() => setTermsAndConditions(!termsAndConditions)} /> Accept Terms & Conditions
              </label>
            </div>
            <button className={styles.saveButton}>Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;
