import mongoose, { Document, Model } from "mongoose";

/**
 * Mongoose schema for the Personal Details document.
 * @param {Object} schemaDefinition - Definition of the personal details schema.
 * @param {String} schemaDefinition.fullName - Full name.
 * @param {String} schemaDefinition.email - Email address.
 * @param {String} schemaDefinition.gender - Gender.
 * @param {String} [schemaDefinition.resume] - Resume path.
 * @param {String} [schemaDefinition.location] - Location.
 * @param {String} [schemaDefinition.phoneNumber] - Phone number.
 * @param {String} [schemaDefinition.profilePhoto] - Profile Photo.
 */
const personalDetailsSchema = new mongoose.Schema(
  {
    fullName: { type: String },
    email: { type: String },
    gender: { type: String },
    resume: { type: String },
    location: { type: String },
    phoneNumber: { type: String },
    profilePhoto: { type: String },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Past Experience document.
 * @param {Object} schemaDefinition - Definition of the past experience schema.
 * @param {String} schemaDefinition.currentJobTitle - Current job title.
 * @param {String} schemaDefinition.companyName - Company name.
 * @param {String} schemaDefinition.industry - Industry.
 * @param {Number} schemaDefinition.yearsOfExperience - Years of experience.
 * @param {String} schemaDefinition.highestDegreeAttained - Highest degree attained.
 * @param {String} schemaDefinition.universityInstitutionName - University or institution name.
 * @param {String} schemaDefinition.fieldOfStudy - Field of study.
 * @param {Number} schemaDefinition.graduationYear - Graduation year.
 * @param {String[]} schemaDefinition.keySkills - List of key skills.
 * @param {String[]} schemaDefinition.certificationsLicenses - List of certifications/licenses.
 */
const pastExperienceSchema = new mongoose.Schema(
  {
    currentJobTitle: { type: String },
    companyName: { type: String },
    industry: { type: String },
    yearsOfExperience: { type: Number },
    highestDegreeAttained: { type: String },
    universityInstitutionName: { type: String },
    fieldOfStudy: { type: String },
    graduationYear: { type: Number },
    keySkills: { type: [String] },
    certificationsLicenses: { type: [String] },
  },
  { _id: false, timestamps: false }
);

/**
 * Mongoose schema for the Past Work History document.
 * @param {Object} schemaDefinition - Definition of the past work history schema.
 * @param {String} schemaDefinition.previousJobTitle - Previous job title.
 * @param {String} schemaDefinition.companyName - Company name.
 * @param {String} schemaDefinition.employmentDates - Employment dates.
 * @param {String[]} schemaDefinition.responsiblitiesAchievements - List of responsibilities/achievements.
 * @param {String} schemaDefinition.personalBioSummary - Personal bio/summary.
 * @param {String} schemaDefinition.availablityReferrals - Availability and referrals.
 * @param {String} schemaDefinition.jobPreferences - Job preferences.
 */
const pastWorkHistorySchema = new mongoose.Schema(
  {
    previousJobTitle: { type: String },
    companyName: { type: String },
    employmentDates: { type: String },
    responsiblitiesAchievements: { type: [String] },
    personalBioSummary: { type: String },
    availablityReferrals: { type: String },
    jobPreferences: { type: String },
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
    personalDetails: {
      fullName: string;
      email: string;
      gender: string;
      resume?: string;
      location?: string;
      phoneNumber?: number;
    };
    pastExperience: {
      currentJobTitle: string;
      companyName: string;
      industry: string;
      yearsOfExperience: number;
      highestDegreeAttained: string;
      universityInstitutionName: string;
      fieldOfStudy: string;
      graduationYear: number;
      keySkills: string[];
      certificationsLicenses: string[];
    };
    pastWorkHistory: {
      previousJobTitle: string;
      companyName: string;
      employmentDates: string;
      responsiblitiesAchievements: string[];
      personalBioSummary: string;
      availablityReferrals: string;
      jobPreferences: string;
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
 * @param {Object} schemaDefinition.userDetails.personalDetails - Personal details schema.
 * @param {String} schemaDefinition.userDetails.personalDetails.fullName - Full name.
 * @param {String} schemaDefinition.userDetails.personalDetails.email - Email address.
 * @param {String} schemaDefinition.userDetails.personalDetails.gender - Gender.
 * @param {String} [schemaDefinition.userDetails.personalDetails.resume] - Resume path (optional).
 * @param {String} [schemaDefinition.userDetails.personalDetails.location] - Location (optional).
 * @param {String} [schemaDefinition.userDetails.personalDetails.phoneNumber] - Phone number (optional).
 * @param {String} [schemaDefinition.userDetails.personalDetails.profilePhoto] - Profile photo (optional).
 * @param {Object} schemaDefinition.userDetails.pastExperience - Past experience schema.
 * @param {String} schemaDefinition.userDetails.pastExperience.currentJobTitle - Current job title.
 * @param {String} schemaDefinition.userDetails.pastExperience.companyName - Company name.
 * @param {String} schemaDefinition.userDetails.pastExperience.industry - Industry.
 * @param {Number} schemaDefinition.userDetails.pastExperience.yearsOfExperience - Years of experience.
 * @param {String} schemaDefinition.userDetails.pastExperience.highestDegreeAttained - Highest degree attained.
 * @param {String} schemaDefinition.userDetails.pastExperience.universityInstitutionName - University or institution name.
 * @param {String} schemaDefinition.userDetails.pastExperience.fieldOfStudy - Field of study.
 * @param {Number} schemaDefinition.userDetails.pastExperience.graduationYear - Graduation year.
 * @param {String[]} schemaDefinition.userDetails.pastExperience.keySkills - List of key skills.
 * @param {String[]} schemaDefinition.userDetails.pastExperience.certificationsLicenses - List of certifications/licenses.
 * @param {Object} schemaDefinition.userDetails.pastWorkHistory - Past work history schema.
 * @param {String} schemaDefinition.userDetails.pastWorkHistory.previousJobTitle - Previous job title.
 * @param {String} schemaDefinition.userDetails.pastWorkHistory.companyName - Company name.
 * @param {String} schemaDefinition.userDetails.pastWorkHistory.employmentDates - Employment dates.
 * @param {String[]} schemaDefinition.userDetails.pastWorkHistory.responsiblitiesAchievements - List of responsibilities/achievements.
 * @param {String} schemaDefinition.userDetails.pastWorkHistory.personalBioSummary - Personal bio/summary.
 * @param {String} schemaDefinition.userDetails.pastWorkHistory.availablityReferrals - Availability and referrals.
 * @param {String} schemaDefinition.userDetails.pastWorkHistory.jobPreferences - Job preferences.
 * @param {Object} schemaDefinition.userDetails.socialLinks - Social links schema.
 * @param {String} schemaDefinition.userDetails.socialLinks.linkedInUrl - LinkedIn URL.
 * @param {String} schemaDefinition.userDetails.socialLinks.gitHubUrl - GitHub URL.
 * @param {String} schemaDefinition.userDetails.socialLinks.websiteUrl - Website URL.
 */
const accountDetailsSchema = new mongoose.Schema<AccountDetailsDocument>(
  {
    _id: { type: String, required: true }, // Added userId field
    userDetails: {
      type: new mongoose.Schema(
        {
          personalDetails: { type: personalDetailsSchema, default: null },
          pastExperience: { type: pastExperienceSchema, default: null },
          pastWorkHistory: { type: pastWorkHistorySchema, default: null },
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
