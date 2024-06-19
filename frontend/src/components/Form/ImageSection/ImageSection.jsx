import React from "react";
import { ReactComponent as UserSvg } from "../../../assets/svg/user.svg";
import styles from "../Form.module.css";
import styles1 from './ImageSection.module.css';

const ImageSection = () => {
  return (
    <div className={styles.imageSection}>
      <div className={styles.uploadImage}>
        <UserSvg className={styles.userSvg} />
      </div>
      <button className={styles1.uploadButton}>Upload Image</button>
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
  );
};

export default ImageSection;
