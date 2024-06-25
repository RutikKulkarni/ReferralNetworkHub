import {
  resumeUploadStyles as styles,
  useState, PiFilePdfLight,
  BsFiletypeDoc,
  BsFiletypeDocx,
  FiUploadCloud,
  FiTrash2
} from '../imports'

const ResumeUpload = ({ setResume }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTypeIcon, setFileTypeIcon] = useState(null);
  const [error, setError] = useState("");
  const [fileInputValue, setFileInputValue] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // To Check file type and size
    if (file) {
      const fileSize = file.size / 1024 / 1024;
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError("Please select a DOC, DOCX, or PDF file.");
        setSelectedFile(null);
        setFileTypeIcon(null);
        return;
      }

      if (fileSize > 2) {
        setError("File size should be less than 2 MB.");
        setSelectedFile(null);
        setFileTypeIcon(null);
        return;
      }

      setSelectedFile(file);

      // For file type icon
      if (file.type === "application/pdf") {
        setFileTypeIcon(<PiFilePdfLight />);
      } else if (file.type === "application/msword") {
        setFileTypeIcon(<BsFiletypeDoc />);
      } else if (
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFileTypeIcon(<BsFiletypeDocx />);
      }
      setFileInputValue(file.name);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setFileTypeIcon(null);
    setError("");
    setFileInputValue("");
  };

  return (
    <div className={styles.resumeUploadContainer}>
      {!selectedFile ? (
        <>
          <div className={styles.iconContainer}>
            <FiUploadCloud />
          </div>
          <div className={styles.textContainer}>
            <div className={styles.title}>
              Choose Resume or drag & drop it here
            </div>
            <div className={styles.subtitle}>
              DOC, DOCX and PDF with a maximum file size of 2 MB
              {error && <p className={styles.error}>{error}</p>}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <input
              type="file"
              id="fileUpload"
              className={styles.fileInput}
              onChange={handleFileChange}
              accept=".doc, .docx, .pdf"
              value={fileInputValue}
            />
            <label htmlFor="fileUpload" className={styles.browseButton}>
              Browse File
            </label>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </>
      ) : (
        <div className={styles.fileInfo}>
          <div className={styles.iconContainer}>{fileTypeIcon}</div>
          <div className={styles.textContainer}>
            <div className={styles.fileName}>{selectedFile.name}</div>
            <div className={styles.subtitle}>Successfully uploaded</div>
          </div>
          <div className={styles.buttonDelete}>
            <FiTrash2 onClick={handleFileRemove} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
