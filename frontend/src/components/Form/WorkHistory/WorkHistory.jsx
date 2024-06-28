import { formStyles as styles, workHistoryStyles as styles1, FiInfo, FiTrash2, Tooltip, DatePicker, } from "../imports";
import "react-datepicker/dist/react-datepicker.css";

const WorkHistory = ({
  isDisabled,
  workHistoryFields,
  setWorkHistoryFields,
}) => {
  const addWorkHistoryFields = () => {
    setWorkHistoryFields([
      ...workHistoryFields,
      {
        previousJobTitle: "",
        companyName: "",
        employmentDates: "",
        responsibilitiesAchievements: "",
      },
    ]);
  };

  const removeWorkHistoryField = (index) => {
    const updatedFields = workHistoryFields.filter((_, i) => i !== index);
    setWorkHistoryFields(updatedFields);
  };

  const handleDateChange = (dates, index) => {
    const [start, end] = dates;
    const startDateString = start
      ? start.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "";
    const endDateString = end
      ? end.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : "";
    const employmentDates = `${startDateString} To ${endDateString}`;

    const updatedFields = [...workHistoryFields];
    updatedFields[index].employmentDates = employmentDates;
    setWorkHistoryFields(updatedFields);
  };

  const parseEmploymentDates = (employmentDates) => {
    if (!employmentDates || typeof employmentDates !== "string")
      return [null, null];
    const dates = employmentDates.split(" To ");
    const start = dates[0] ? new Date(dates[0]) : null;
    const end = dates[1] ? new Date(dates[1]) : null;
    return [start, end];
  };

  return (
    <div className={styles.workHistory}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h3>Work History</h3>
          <FiInfo className={styles1.icon} data-tip data-for="info-tooltip" />
        </div>
        {!isDisabled && (
          <div className={styles1.options} onClick={addWorkHistoryFields}>
            <span>Add +</span>
          </div>
        )}
      </div>
      <Tooltip
        anchorSelect={`.${styles1.icon}`}
        place="top"
        id="info-tooltip"
        type="light"
        effect="solid"
      >
        <span className={styles1.tooltipContent}>
          If you have experience, fill in these fields.<br></br>
          If disabled, select 'Experienced' in <br></br>
          Professional Information.
        </span>
      </Tooltip>
      {workHistoryFields?.map((field, index) => (
        <div key={index} className={styles1.workHistoryEntry}>
          <div className={styles1.entryHeader}>
            {index > 0 && <p>Work {index + 1}</p>}
            <div className={styles.inputRow}>
              <input
                type="text"
                placeholder="Previous Job Title"
                className={`${styles.inputField} ${
                  isDisabled ? styles.disabledInput : ""
                }`}
                value={field.previousJobTitle}
                disabled={isDisabled}
                onChange={(e) => {
                  const updatedFields = [...workHistoryFields];
                  updatedFields[index].previousJobTitle = e.target.value;
                  setWorkHistoryFields(updatedFields);
                }}
              />
              <input
                type="text"
                placeholder="Company Name"
                className={`${styles.inputField} ${
                  isDisabled ? styles.disabledInput : ""
                }`}
                value={field.companyName}
                disabled={isDisabled}
                onChange={(e) => {
                  const updatedFields = [...workHistoryFields];
                  updatedFields[index].companyName = e.target.value;
                  setWorkHistoryFields(updatedFields);
                }}
              />
            </div>
            <div className={styles.inputRow}>
              <DatePicker
                type="text"
                selectsRange
                startDate={parseEmploymentDates(field.employmentDates)[0]}
                endDate={parseEmploymentDates(field.employmentDates)[1]}
                onChange={(dates) => handleDateChange(dates, index)}
                disabled={isDisabled}
                dateFormat="MMM yyyy"
                className={`${styles.inputField} ${
                  isDisabled ? styles.disabledInput : ""
                }`}
                value={field.employmentDates}
                placeholderText="Select Employment Dates"
                showMonthYearPicker
                showFullMonthYearPicker
              />
              <input
                type="text"
                placeholder="Responsibilities and Achievements (Optional)"
                className={`${styles.inputField} ${
                  isDisabled ? styles.disabledInput : ""
                }`}
                value={field.responsibilitiesAchievements}
                disabled={isDisabled}
                onChange={(e) => {
                  const updatedFields = [...workHistoryFields];
                  updatedFields[index].responsibilitiesAchievements =
                    e.target.value;
                  setWorkHistoryFields(updatedFields);
                }}
              />
            </div>
            {index > 0 && (
              <div
                className={styles1.deleteIcon}
                onClick={() => removeWorkHistoryField(index)}
              >
                <FiTrash2 />
                <span>Delete</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkHistory;
