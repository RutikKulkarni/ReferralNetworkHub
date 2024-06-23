import mongoose, { Document, Model } from "mongoose";

/**
 * Mongoose schema for the Personal Information document.
 * @param {Object} schemaDefinition - Definition of the personal information schema.
 * @param {String} schemaDefinition.fullName - Full name.
 * @param {String} schemaDefinition.email - Email address.
 * @param {String} schemaDefinition.gender - Gender.
 * @param {String} [schemaDefinition.resume] - Resume path (optional).
 * @param {String} [schemaDefinition.location] - Location (optional).
 * @param {Number} [schemaDefinition.phoneNumber] - Phone number (optional).
 * @param {String} [schemaDefinition.profilePhoto] - Profile photo (optional).
 */
const personalInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String },
    gender: { type: String },
    resume: { type: String },
    location: { type: String },
    phoneNumber: { type: Number },
    profilePhoto: { type: String },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Professional Information document.
 * @param {Object} schemaDefinition - Definition of the professional information schema.
 * @param {String} schemaDefinition.currentJobTitle - Current job title.
 * @param {String} schemaDefinition.companyName - Company name.
 * @param {String} schemaDefinition.industry - Industry.
 * @param {Number} schemaDefinition.yearsOfExperience - Years of experience.
 */
const professionalInfoSchema = new mongoose.Schema(
  {
    currentJobTitle: { type: String },
    companyName: { type: String },
    industry: { type: String },
    yearsOfExperience: { type: Number },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Education Information document.
 * @param {Object} schemaDefinition - Definition of the education information schema.
 * @param {String} schemaDefinition.highestDegreeAttained - Highest degree attained.
 * @param {String} schemaDefinition.uniInsName - University or institution name.
 * @param {String} schemaDefinition.fieldOfStudy - Field of study.
 * @param {Number} schemaDefinition.graduationYear - Graduation year.
 */
const educationInfoSchema = new mongoose.Schema(
  {
    highestDegreeAttained: { type: String, default: "" },
    uniInsName: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    graduationYear: { type: Number, default: null },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Skills and Expertise document.
 * @param {Object} schemaDefinition - Definition of the skills and expertise schema.
 * @param {String[]} schemaDefinition.keySkills - List of key skills.
 * @param {String[]} schemaDefinition.certificationsLicenses - List of certifications/licenses.
 */
const skillsExpertiseSchema = new mongoose.Schema(
  {
    keySkills: { type: [String], default: [] },
    certificationsLicenses: { type: [String], default: [] },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Work History document.
 * @param {Object} schemaDefinition - Definition of the work history schema.
 * @param {String} schemaDefinition.previousJobTitle - Previous job title.
 * @param {String} schemaDefinition.companyName - Company name.
 * @param {String} schemaDefinition.employmentDates - Employment dates.
 * @param {String[]} schemaDefinition.responsibilitiesAchievements - List of responsibilities/achievements.
 */
const workHistorySchema = new mongoose.Schema(
  {
    previousJobTitle: { type: String, default: "" },
    companyName: { type: String, default: "" },
    employmentDates: { type: String, default: "" },
    responsibilitiesAchievements: { type: [String], default: [] },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Preferences document.
 * @param {Object} schemaDefinition - Definition of the preferences schema.
 * @param {String} schemaDefinition.availabilityForReferrals - Availability for referrals.
 * @param {String} schemaDefinition.jobPreferences - Job preferences.
 */
const preferencesSchema = new mongoose.Schema(
  {
    availabilityForReferrals: { type: String, default: "" },
    jobPreferences: { type: String, default: "" },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Additional Information document.
 * @param {Object} schemaDefinition - Definition of the additional information schema.
 * @param {String} schemaDefinition.personalBio - Personal bio.
 */
const additionalInfoSchema = new mongoose.Schema(
  {
    personalBio: { type: String, default: "" },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Social Links document.
 * @param {Object} schemaDefinition - Definition of the social links schema.
 * @param {String} schemaDefinition.linkedInUrl - LinkedIn URL.
 * @param {String} schemaDefinition.gitHubUrl - GitHub URL.
 * @param {String} schemaDefinition.websiteUrl - Website URL.
 */
const socialLinksSchema = new mongoose.Schema(
  {
    linkedInUrl: { type: String },
    gitHubUrl: { type: String },
    websiteUrl: { type: String },
  },
  { _id: false, timestamps: false }
);

/**
 * Interface representing a User Account Details document.
 * @interface
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
      phoneNumber?: number;
      profilePhoto?: string;
    };
    professionalInfo: {
      currentJobTitle: string;
      companyName: string;
      industry: string;
      yearsOfExperience: number;
    };
    education: {
      highestDegreeAttained: string;
      uniInsName: string;
      fieldOfStudy: string;
      graduationYear: number;
    };
    skillsExpertise: {
      keySkills: string[];
      certificationsLicenses: string[];
    };
    workHistory: {
      previousJobTitle: string;
      companyName: string;
      employmentDates: string;
      responsibilitiesAchievements: string[];
    };
    preferences: {
      availabilityForReferrals: string;
      jobPreferences: string;
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
 * @param {Object} schemaDefinition - Definition of the user account details schema.
 * @param {String} schemaDefinition._id - User ID.
 * @param {Object} schemaDefinition.userDetails - User details schema.
 * @param {Object} schemaDefinition.userDetails.personalInfo - Personal information schema.
 * @param {String} schemaDefinition.userDetails.personalInfo.fullName - Full name.
 * @param {String} schemaDefinition.userDetails.personalInfo.email - Email address.
 * @param {String} schemaDefinition.userDetails.personalInfo.gender - Gender.
 * @param {String} [schemaDefinition.userDetails.personalInfo.resume] - Resume path (optional).
 * @param {String} [schemaDefinition.userDetails.personalInfo.location] - Location (optional).
 * @param {Number} [schemaDefinition.userDetails.personalInfo.phoneNumber] - Phone number (optional).
 * @param {String} [schemaDefinition.userDetails.personalInfo.profilePhoto] - Profile photo (optional).
 * @param {Object} schemaDefinition.userDetails.professionalInfo - Professional information schema.
 * @param {String} schemaDefinition.userDetails.professionalInfo.currentJobTitle - Current job title.
 * @param {String} schemaDefinition.userDetails.professionalInfo.companyName - Company name.
 * @param {String} schemaDefinition.userDetails.professionalInfo.industry - Industry.
 * @param {Number} schemaDefinition.userDetails.professionalInfo.yearsOfExperience - Years of experience.
 * @param {Object} schemaDefinition.userDetails.education - Education information schema.
 * @param {String} schemaDefinition.userDetails.education.highestDegreeAttained - Highest degree attained.
 * @param {String} schemaDefinition.userDetails.education.uniInsName - University or institution name.
 * @param {String} schemaDefinition.userDetails.education.fieldOfStudy - Field of study.
 * @param {Number} schemaDefinition.userDetails.education.graduationYear - Graduation year.
 * @param {String[]} schemaDefinition.userDetails.skillsExpertise.keySkills - List of key skills.
 * @param {String[]} schemaDefinition.userDetails.skillsExpertise.certificationsLicenses - List of certifications/licenses.
 * @param {Object} schemaDefinition.userDetails.workHistory - Work history schema.
 * @param {String} schemaDefinition.userDetails.workHistory.previousJobTitle - Previous job title.
 * @param {String} schemaDefinition.userDetails.workHistory.companyName - Company name.
 * @param {String} schemaDefinition.userDetails.workHistory.employmentDates - Employment dates.
 * @param {String[]} schemaDefinition.userDetails.workHistory.responsibilitiesAchievements - List of responsibilities/achievements.
 * @param {Object} schemaDefinition.userDetails.preferences - Preferences schema.
 * @param {String} schemaDefinition.userDetails.preferences.availabilityForReferrals - Availability for referrals.
 * @param {String} schemaDefinition.userDetails.preferences.jobPreferences - Job preferences.
 * @param {Object} schemaDefinition.userDetails.additionalInfo - Additional information schema.
 * @param {String} schemaDefinition.userDetails.additionalInfo.personalBio - Personal bio.
 * @param {Object} schemaDefinition.userDetails.socialLinks - Social links schema.
 * @param {String} schemaDefinition.userDetails.socialLinks.linkedInUrl - LinkedIn URL.
 * @param {String} schemaDefinition.userDetails.socialLinks.gitHubUrl - GitHub URL.
 * @param {String} schemaDefinition.userDetails.socialLinks.websiteUrl - Website URL.
 */
const accountDetailsSchema = new mongoose.Schema<AccountDetailsDocument>(
  {
    _id: { type: String, required: true },
    userDetails: {
      type: new mongoose.Schema(
        {
          personalInfo: { type: personalInfoSchema, default: null },
          professionalInfo: { type: professionalInfoSchema, default: null },
          education: { type: educationInfoSchema, default: null },
          skillsExpertise: { type: skillsExpertiseSchema, default: null },
          workHistory: { type: workHistorySchema, default: null },
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

export { accountDetailsModel };
export { AccountDetailsDocument };
