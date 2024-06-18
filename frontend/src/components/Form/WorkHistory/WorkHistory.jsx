// import React from "react";
// import styles from "../Form.module.css";

// const WorkHistory = () => {
//   return (
//     <div className={styles.workHistory}>
//       <h3>Work History</h3>
//       <div className={styles.inputRow}>
//         <input
//           type="text"
//           placeholder="Previous Job Title"
//           className={styles.inputField}
//         />
//         <input
//           type="text"
//           placeholder="Company Name"
//           className={styles.inputField}
//         />
//       </div>
//       <div className={styles.inputRow}>
//         <input
//           type="text"
//           placeholder="Employment Dates (e.g., Jan 2020 to Dec 2023)"
//           className={styles.inputField}
//         />
//         <input
//           type="text"
//           placeholder="Responsibilities and Achievements (Optional)"
//           className={styles.inputField}
//         />
//       </div>
//     </div>
//   );
// };

// export default WorkHistory;

import React from "react";
import styles from "../Form.module.css";

const WorkHistory = ({ isDisabled }) => {
  return (
    <div className={styles.workHistory}>
      <h3>Work History</h3>
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Previous Job Title"
          className={styles.inputField}
          disabled={isDisabled}
        />
        <input
          type="text"
          placeholder="Company Name"
          className={styles.inputField}
          disabled={isDisabled}
        />
      </div>
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Employment Dates (e.g., Jan 2020 to Dec 2023)"
          className={styles.inputField}
          disabled={isDisabled}
        />
        <input
          type="text"
          placeholder="Responsibilities and Achievements (Optional)"
          className={styles.inputField}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};

export default WorkHistory;
