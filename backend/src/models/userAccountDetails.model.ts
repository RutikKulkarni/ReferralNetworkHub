import mongoose, { Document, Model } from "mongoose";

/**
 * Mongoose schema for the Personal Information document.
 * @type {mongoose.Schema}
 */
const personalInfoSchema: mongoose.Schema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    gender: { type: String, default: "" },
    resume: { type: String, default: "" },
    location: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Professional Information document.
 * @type {mongoose.Schema}
 */
const professionalInfoSchema: mongoose.Schema = new mongoose.Schema(
  {
    currentJobTitle: { type: String, default: "" },
    companyName: { type: String, default: "" },
    industry: { type: String, default: "" },
    yearsOfExperience: { type: String, default: "" },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Education Information document.
 * @type {mongoose.Schema}
 */
const educationInfoSchema: mongoose.Schema = new mongoose.Schema(
  {
    highestDegreeAttained: { type: String, default: "" },
    uniInsName: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    graduationYear: { type: String, default: "" },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Skills and Expertise document.
 * @type {mongoose.Schema}
 */
const skillsExpertiseSchema: mongoose.Schema = new mongoose.Schema(
  {
    keySkills: { type: [String], default: [] },
    certificationsLicenses: { type: [String], default: [] },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Work History document.
 * @type {mongoose.Schema}
 */
const workHistorySchema: mongoose.Schema = new mongoose.Schema(
  {
    previousJobTitle: { type: String, default: "" },
    companyName: { type: String, default: "" },
    employmentDates: { type: String, default: "" },
    responsibilitiesAchievements: { type: String, default: "" },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Preferences document.
 * @type {mongoose.Schema}
 */
const preferencesSchema: mongoose.Schema = new mongoose.Schema(
  {
    availabilityForReferrals: { type: String, default: "" },
    jobPreferences: { type: [String], default: [] },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Additional Information document.
 * @type {mongoose.Schema}
 */
const additionalInfoSchema: mongoose.Schema = new mongoose.Schema(
  {
    personalBio: { type: String, default: "" },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Social Links document.
 * @type {mongoose.Schema}
 */
const socialLinksSchema: mongoose.Schema = new mongoose.Schema(
  {
    linkedInUrl: { type: String, default: "" },
    gitHubUrl: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
  },
  { _id: false, timestamps: false }
);

/**
 * Interface representing a User Account Details document.
 * @interface
 * @param {Object} userDetails - User details schema.
 * @param {Object} userDetails.personalInfo - Personal information schema.
 * @param {String} userDetails.personalInfo.fullName - Full name.
 * @param {String} userDetails.personalInfo.email - Email address.
 * @param {String} userDetails.personalInfo.gender - Gender.
 * @param {String} [userDetails.personalInfo.resume] - Resume path (optional).
 * @param {String} [userDetails.personalInfo.location] - Location (optional).
 * @param {String} [userDetails.personalInfo.phoneNumber] - Phone number (optional).
 * @param {String} [userDetails.personalInfo.profilePhoto] - Profile photo (optional).
 * @param {Object} userDetails.professionalInfo - Professional information schema.
 * @param {String} userDetails.professionalInfo.currentJobTitle - Current job title.
 * @param {String} userDetails.professionalInfo.companyName - Company name.
 * @param {String} userDetails.professionalInfo.industry - Industry.
 * @param {String} userDetails.professionalInfo.yearsOfExperience - Years of experience.
 * @param {Object} userDetails.education - Education information schema.
 * @param {String} userDetails.education.highestDegreeAttained - Highest degree attained.
 * @param {String} userDetails.education.uniInsName - University or institution name.
 * @param {String} userDetails.education.fieldOfStudy - Field of study.
 * @param {String} userDetails.education.graduationYear - Graduation year.
 * @param {String[]} userDetails.skillsExpertise.keySkills - List of key skills.
 * @param {String[]} userDetails.skillsExpertise.certificationsLicenses - List of certifications/licenses.
 * @param {Object} userDetails.workHistory - Work history schema.
 * @param {String} userDetails.workHistory.previousJobTitle - Previous job title.
 * @param {String} userDetails.workHistory.companyName - Company name.
 * @param {String} userDetails.workHistory.employmentDates - Employment dates.
 * @param {String} userDetails.workHistory.responsibilitiesAchievements - responsibilities/achievements.
 * @param {Object} userDetails.preferences - Preferences schema.
 * @param {String} userDetails.preferences.availabilityForReferrals - Availability for referrals.
 * @param {String} userDetails.preferences.jobPreferences - Job preferences.
 * @param {Object} userDetails.additionalInfo - Additional information schema.
 * @param {String} userDetails.additionalInfo.personalBio - Personal bio.
 * @param {Object} userDetails.socialLinks - Social links schema.
 * @param {String} userDetails.socialLinks.linkedInUrl - LinkedIn URL.
 * @param {String} userDetails.socialLinks.gitHubUrl - GitHub URL.
 * @param {String} userDetails.socialLinks.websiteUrl - Website URL.
 */
interface AccountDetailsDocument extends Document {
  _id: string;
  userDetails: {
    personalInfo: {
      fullName: string;
      email: string;
      gender: string;
      resume?: string;
      location?: string;
      phoneNumber?: string;
      profilePhoto?: string;
    };
    professionalInfo: {
      currentJobTitle: string;
      companyName: string;
      industry: string;
      yearsOfExperience: string;
    };
    education: {
      highestDegreeAttained: string;
      uniInsName: string;
      fieldOfStudy: string;
      graduationYear: string;
    };
    skillsExpertise: {
      keySkills: string[];
      certificationsLicenses: string[];
    };
    workHistory: Array<{
      previousJobTitle: string;
      companyName: string;
      employmentDates: string;
      responsibilitiesAchievements: string;
    }>;
    preferences: {
      availabilityForReferrals: string;
      jobPreferences: string[];
    };
    additionalInfo: {
      personalBio: string;
    };
    socialLinks: {
      linkedInUrl: string;
      gitHubUrl: string;
      websiteUrl: string;
    };
  };
}

/**
 * Mongoose schema for the User Account Details document.
 * @type {mongoose.Schema}
 */
const accountDetailsSchema: mongoose.Schema = new mongoose.Schema<AccountDetailsDocument>(
  {
    _id: { type: String, required: true },
    userDetails: {
      type: new mongoose.Schema(
        {
          personalInfo: { type: personalInfoSchema, default: null },
          professionalInfo: { type: professionalInfoSchema, default: null },
          education: { type: educationInfoSchema, default: null },
          skillsExpertise: { type: skillsExpertiseSchema, default: null },
          workHistory: { type: [workHistorySchema], default: [] },
          preferences: { type: preferencesSchema, default: null },
          additionalInfo: { type: additionalInfoSchema, default: null },
          socialLinks: { type: socialLinksSchema, default: null },
        },
        { _id: false, timestamps: false }
      ),
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Mongoose model for the User Account Details document.
 * @type {Model<AccountDetailsDocument>}
 */
const accountDetailsModel: Model<AccountDetailsDocument> =
  mongoose.model<AccountDetailsDocument>(
    "AccountDetails",
    accountDetailsSchema
  );

export { accountDetailsModel, AccountDetailsDocument };
