import React from 'react';
import { useNavigate } from "react-router-dom";
import { ReactComponent as UserSvg } from "../../assets/svg/user.svg";
import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";
import { TbExternalLink } from "react-icons/tb";
import styles from './Profile.module.css';

const Profile = () => {
    const navigate = useNavigate();
    const handleEditAccountInfo = () => {
      navigate("/EditAccountInfo");
    };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.leftSection}>
        <UserSvg className={styles.profileImage}/>
        <div className={styles.socialLinks}>
          <a href="https://www.linkedin.com/in/username" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn/>
          </a>
          <a href="https://github.com/username" target="_blank" rel="noopener noreferrer">
            <SiGithub/>
          </a>
          <a href="https://www.website.com" target="_blank" rel="noopener noreferrer">
            <TbExternalLink/>
          </a>
        </div>
        <button className={styles.downloadButton}>Download Resume</button>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.header}>
          <h1 className={styles.name}>John Doe</h1>
          <p className={styles.designation}>Designation | Location (City, Country)</p>
          <button className={styles.editButton} onClick={handleEditAccountInfo}>Edit Information</button>
        </div>
        <div className={styles.contactInfo}>
          <p>Phone: +91 1234567890</p>
          <p>Email: abc@gmail.com</p>
          <p>Gender: Male / Female / Other</p>
        </div>
        <div className={styles.section}>
          <h2>Professional Information</h2>
          <p>Job Title: Software Developer</p>
          <p>Company Name: Referral Network</p>
          <p>Industry: IT Industry</p>
          <p>Experience: 1+ Years</p>
        </div>
        <div className={styles.section}>
          <h2>Education</h2>
          <p>Highest Degree Attained: B.Tech</p>
          <p>Field of Study: Computer</p>
          <p>Graduation Year: 0000</p>
          <p>University/Institution Name: Referral Network</p>
        </div>
        <div className={styles.section}>
          <h2>Skills and Expertise</h2>
          <p>Key Skills: ReactJs, NodeJs, MongoDB, Mongoose</p>
          <p>Certifications or Licenses: Referral Network</p>
        </div>
        <div className={styles.section}>
          <h2>Work History</h2>
          <p>Previous Job Title: Jr. Software Developer</p>
          <p>Company Name: Referral Network</p>
          <p>Employment Dates: Jan 2020 To Dec 2023</p>
          <p>Responsibilities and Achievements: Referral Network</p>
        </div>
        <div className={styles.section}>
          <h2>Additional Information</h2>
          <p>
            Background elements play a crucial role in the aesthetic and usability of web applications.
            They contribute to the overall design cohesion and user engagement.
          </p>
        </div>
        <div className={styles.section}>
          <p>Available for Referrals: Yes/No</p>
          <p>Job Preferences: SDE, Frontend Developer, Backend Developer</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
