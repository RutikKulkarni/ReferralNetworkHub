// import React, { useState } from "react";
// import { FiInfo } from "react-icons/fi";
// import { Tooltip } from "react-tooltip";
// import styles from "../Form.module.css";
// import styles1 from "./ProfessionalInfo.module.css";

// const ProfessionalInfo = () => {
//   const [selectedOption, setSelectedOption] = useState("Experienced");

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//   };

//   return (
//     <div className={styles.professionalInfo}>
//       <div className={styles1.header}>
//         <div className={styles1.headerInfo}>
//           <h3>Professional Information</h3>
//           <FiInfo className={styles1.icon} data-tip data-for="info-tooltip" />
//         </div>
//         <div className={styles1.options}>
//           <span
//             className={selectedOption === "Experienced" ? styles1.active : ""}
//             onClick={() => handleOptionClick("Experienced")}
//           >
//             Experienced
//           </span>
//           <span>/</span>
//           <span
//             className={selectedOption === "Fresher" ? styles1.active : ""}
//             onClick={() => handleOptionClick("Fresher")}
//           >
//             Fresher
//           </span>
//         </div>
//       </div>
//       <Tooltip
//         anchorSelect={`.${styles1.icon}`}
//         place="top"
//         id="info-tooltip"
//         type="light"
//         effect="solid"
//       >
//         <span className={styles1.tooltipContent}>
//           If you are Experienced but currently not working then, Please only
//           fill in the "Industry" and "Years of Experience" fields. For other
//           fields such as job title, company name, please enter "NA" (which
//           stands for "Not Applicable").
//         </span>
//       </Tooltip>
//       <div className={styles.inputRow}>
//         <input
//           type="text"
//           placeholder="Current Job Title"
//           className={styles.inputField}
//           disabled={selectedOption === "Fresher"}
//           required={selectedOption === "Experienced"}
//         />
//         <input
//           type="text"
//           placeholder="Company Name"
//           className={styles.inputField}
//           disabled={selectedOption === "Fresher"}
//           required={selectedOption === "Experienced"}
//         />
//       </div>
//       <div className={styles.inputRow}>
//         <input
//           type="text"
//           placeholder="Industry"
//           className={styles.inputField}
//           disabled={selectedOption === "Fresher"}
//           required={selectedOption === "Experienced"}
//         />
//         <input
//           type="text"
//           placeholder="Years of Experience"
//           className={styles.inputField}
//           disabled={selectedOption === "Fresher"}
//           required={selectedOption === "Experienced"}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProfessionalInfo;

import React, { useState } from "react";
import { FiInfo } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import styles from "../Form.module.css";
import styles1 from "./ProfessionalInfo.module.css";

const ProfessionalInfo = ({ handleOptionClick, selectedOption }) => {
  return (
    <div className={styles.professionalInfo}>
      <div className={styles1.header}>
        <div className={styles1.headerInfo}>
          <h3>Professional Information</h3>
          <FiInfo className={styles1.icon} data-tip data-for="info-tooltip" />
        </div>
        <div className={styles1.options}>
          <span
            className={selectedOption === "Experienced" ? styles1.active : ""}
            onClick={() => handleOptionClick("Experienced")}
          >
            Experienced
          </span>
          <span>/</span>
          <span
            className={selectedOption === "Fresher" ? styles1.active : ""}
            onClick={() => handleOptionClick("Fresher")}
          >
            Fresher
          </span>
        </div>
      </div>
      <Tooltip
        anchorSelect={`.${styles1.icon}`}
        place="top"
        id="info-tooltip"
        type="light"
        effect="solid"
      >
        <span className={styles1.tooltipContent}>
          If you are Experienced but currently not working then, Please only
          fill in the "Industry" and "Years of Experience" fields. For other
          fields such as job title, company name, please enter "NA" (which
          stands for "Not Applicable").
        </span>
      </Tooltip>
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Current Job Title"
          className={styles.inputField}
          disabled={selectedOption === "Fresher"}
          required={selectedOption === "Experienced"}
        />
        <input
          type="text"
          placeholder="Company Name"
          className={styles.inputField}
          disabled={selectedOption === "Fresher"}
          required={selectedOption === "Experienced"}
        />
      </div>
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Industry"
          className={styles.inputField}
          disabled={selectedOption === "Fresher"}
          required={selectedOption === "Experienced"}
        />
        <input
          type="text"
          placeholder="Years of Experience"
          className={styles.inputField}
          disabled={selectedOption === "Fresher"}
          required={selectedOption === "Experienced"}
        />
      </div>
    </div>
  );
};

export default ProfessionalInfo;
