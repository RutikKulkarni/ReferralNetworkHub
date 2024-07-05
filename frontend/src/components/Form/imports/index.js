// This file contains all Imports for Form Dir

// Common || Global imports
export { default as axios } from "axios";
// export { Config } from "../../../App";
export { useState } from "react";
export { useNavigate } from "react-router-dom";
export { generateSnackbar, catchError } from "../../../utility/exports";
export {
  resetStates,
  updateUserAccountInfo,
  handleChange,
} from "../formHelperFunc";
export { default as formStyles } from "../Form.module.css";
export { FiInfo, FiTrash2 } from "react-icons/fi";
export { Tooltip } from "react-tooltip";
export { default as ChipTextField } from "../ChipTextField/ChipTextField";

// For ../Form.jsx
export { default as Preferences } from "../Preferences/Preferences";
export { default as ResumeUpload } from "../../Buttons/ResumeUpload/ResumeUpload";
export { default as ImageSection } from "../ImageSection/ImageSection";
export { default as ProfessionalInfo } from "../ProfessionalInfo/ProfessionalInfo";
export { default as WorkHistory } from "../WorkHistory/WorkHistory";
export { default as PersonalInfo } from "../PersonalInfo/PersonalInfo";
export { default as EducationInfo } from "../EducationInfo/EducationInfo";
export { default as SkillsExpertise } from "../SkillsExpertise/SkillsExpertise";
export { default as AdditionalInfo } from "../AdditionalInfo/AdditionalInfo";

// For ../ChipTextField/ChipTextField.jsx
export { default as chipTextFieldStyles } from "../ChipTextField/ChipTextField.module.css";

// For ../ImageSection/ImageSection.jsx
export { ReactComponent as UserSvg } from "../../../assets/svg/user.svg";
export { default as imageSectionStyles } from "../ImageSection/ImageSection.module.css";

// For ../Preferences/Preferences.jsx
export { default as preferencesStyles } from "../Preferences/Preferences.module.css";

// For ../ProfessionalInfo/ProfessionalInfo.jsx
export { default as professionalInfoStyles } from "../ProfessionalInfo/ProfessionalInfo.module.css";

// For ../WorkHistory/WorkHistory.jsx
export { default as workHistoryStyles } from "../WorkHistory/WorkHistory.module.css";
export { default as DatePicker } from 'react-datepicker';
