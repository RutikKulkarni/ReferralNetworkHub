import { axios, catchError, generateSnackbar } from "./imports";
import { Config } from "../../App";

const handleChange = (event, setState) => {
  setState((prev) => ({
    ...prev,
    [event.target.name]: event.target.value,
  }));

  return;
};

const updateUserAccountInfo = async (
  data,
  navigate,
  token = localStorage.getItem("token"),
  userId = localStorage.getItem("userId")
) => {
  try {
    let response = await axios.patch(
      `${Config?.endpoint}user/details/${userId}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response?.status === 200) {
      generateSnackbar(response?.data?.message, "success", 2000);
      navigate("/explore");
    }

    console.log(response, "RESPONSE");
  } catch (err) {
    catchError(err);
  }
};

const resetStates = (
  setPersonalInfo,
  setProfessionalInfo,
  setEducation,
  setSkillsExpertise,
  setWorkHistory,
  setPreferences,
  setAdditionalInfo,
  setSocialLinks
) => {
  setPersonalInfo({
    fullName: "",
    email: "",
    gender: "",
    resume: " ",
    location: "",
    phoneNumber: "",
    profilePhoto: " ",
  });
  setProfessionalInfo({
    currentJobTitle: "",
    companyName: "",
    industry: "",
    yearsOfExperience: "",
  });
  setEducation({
    highestDegreeAttained: "",
    uniInsName: "",
    fieldOfStudy: "",
    graduationYear: "",
  });
  setSkillsExpertise({
    keySkills: [],
    certificationsLicenses: [],
  });
  setWorkHistory([
    {
      previousJobTitle: "",
      companyName: "",
      employmentDates: "",
      responsibilitiesAchievements: "",
    },
  ]);
  setPreferences({
    availabilityForReferrals: "",
    jobPreferences: [],
  });
  setAdditionalInfo({
    personalBio: "",
  });
  setSocialLinks({
    linkedInUrl: "",
    gitHubUrl: "",
    websiteUrl: "",
  });
};

export { handleChange, updateUserAccountInfo, resetStates };
