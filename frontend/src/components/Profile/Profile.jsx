import {
  profileStyles as styles,
  BiSolidEditAlt,
  CgSoftwareDownload,
  FaLinkedinIn,
  SiGithub,
  TbExternalLink,
  UserSvg,
  useNavigate,
}
from './imports'

const Profile = () => {
  const navigate = useNavigate();
  const handleEditAccountInfo = () => {
    navigate("/EditAccountInfo");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.imageUploadSection}>
          <div className={styles.uploadImage}>
            <UserSvg className={styles.userSvg} />
          </div>
          <div className={styles.socialLinks}>
            <a
              href="https://www.linkedin.com/in/username"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGithub />
            </a>
            <a
              href="https://www.website.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TbExternalLink />
            </a>
          </div>
          <button className={styles.button} download>
            <CgSoftwareDownload className={styles.icon} />
            Download Resume
          </button>
        </div>
        <div className={styles.formSection}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.name}>John Doe</h1>
              <p className={styles.designation}>
                Designation | Location (City, Country)
              </p>
            </div>
            <button
              className={styles.button}
              onClick={handleEditAccountInfo}
            >
            <BiSolidEditAlt className={styles.icon} />
              Edit Information
            </button>
          </div>
          <div className={styles.contactInfo}>
          <div className={styles.inputRow}>
            <p> <strong>Phone:</strong> +91 1234567890 </p>
            <p> <strong>Email:</strong> abc@gmail.com </p>
            <p> <strong>Gender:</strong> Male / Female / Other </p>
            </div>
          </div>
          <div className={styles.section}>
            <h3>Professional Information</h3>
            <div className={styles.inputRow}>
              <p>
                <strong>Job Title:</strong> Software Developer
              </p>
              <p>
                <strong>Company Name:</strong> Referral Network
              </p>
              <p>
                <strong>Industry:</strong> IT Industry
              </p>
              <p>
                <strong>Experience:</strong> 1+ Years
              </p>
            </div>
          </div>
          <div className={styles.section}>
            <h3>Education</h3>
            <div className={styles.inputRow}>
              <p>
                <strong>Highest Degree Attained:</strong> B.Tech
              </p>
              <p>
                <strong>Field of Study:</strong> Computer
              </p>
              <p>
                <strong>Graduation Year:</strong> 0000
              </p>
            </div>
            <p>
              <strong>University/Institution Name:</strong> Referral Network
            </p>
          </div>
          <div className={styles.section}>
            <h3>Skills and Expertise</h3>
            <p>
              <strong>Key Skills:</strong> ReactJs, NodeJs, MongoDB, Mongoose
            </p>
            <p>
              <strong>Certifications or Licenses:</strong> Referral Network
            </p>
          </div>
          <div className={styles.section}>
            <h3>Work History</h3>
            <div className={styles.inputRow}>
              <p>
                <strong>Previous Job Title:</strong> Jr. Software Developer
              </p>
              <p>
                <strong>Company Name:</strong> Referral Network
              </p>
            </div>
            {/* <div className={styles.inputRow}> */}
            <div className={`${styles.inputRow} ${styles.noMargin}`}>
              <p>
                <strong>Employment Dates:</strong> Jan 2020 To Dec 2023
              </p>
              <p>
                <strong>Responsibilities and Achievements:</strong> Referral
                Network
              </p>
            </div>
          </div>
          <div className={styles.section}>
            <h3>Additional Information</h3>
            <p>
              Background elements play a crucial role in the aesthetic and
              usability of web applications. They contribute to the overall
              design cohesion and user engagement.
            </p>
            <div className={styles.inputRow}>
              <p>
                <strong>Available for Referrals:</strong> Yes/No
              </p>
            </div>
            <div className={styles.inputRow}>
              <p>
                <strong>Job Preferences:</strong> SDE, Frontend Developer,
                Backend Developer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
