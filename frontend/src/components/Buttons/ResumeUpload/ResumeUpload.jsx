import React from 'react';
import { FiUploadCloud } from "react-icons/fi";
import styles from './ResumeUpload.module.css';

const ResumeUpload = () => {
  return (
    <div className={styles.resumeUploadContainer}>
      <div className={styles.iconContainer}>
        <FiUploadCloud />
      </div>
      <div className={styles.textContainer}>
        <div className={styles.title}>Choose Resume or drag & drop it here</div>
        <div className={styles.subtitle}>DOC, DOCX and PDF with a maximum file size of 5 MB</div>
      </div>
      <div className={styles.buttonContainer}>
        <input type="file" id="fileUpload" className={styles.fileInput} />
        <label htmlFor="fileUpload" className={styles.browseButton}>Browse File</label>
      </div>
    </div>
  );
};

export default ResumeUpload;
