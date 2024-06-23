import Joi, { ArraySchema, ObjectSchema } from "joi";
import objectId from "./custom.validations";

/**
 * Schema for validating user ID.
 *
 * @type {ObjectSchema}
 */
const getUserDetails: ObjectSchema = Joi.object().keys({
  userId: Joi.string().required().custom(objectId),
});

/**
 * Schema for validating Personal Information.
 *
 * @type {ObjectSchema}
 */
const personalInfo: ObjectSchema = Joi.object().keys({
  fullName: Joi.string(),
  email: Joi.string().email(),
  gender: Joi.string(),
  resume: Joi.string(),
  location: Joi.string(),
  phoneNumber: Joi.string().length(10),
  profilePhoto: Joi.string(),
});

/**
 * Schema for validating Professional Information.
 *
 * @type {ObjectSchema}
 */
const professionalInfo: ObjectSchema = Joi.object().keys({
  currentJobTitle: Joi.string(),
  companyName: Joi.string(),
  industry: Joi.string(),
  yearsOfExperience: Joi.string(),
});

/**
 * Schema for validating Education Information.
 *
 * @type {ObjectSchema}
 */
const education: ObjectSchema = Joi.object().keys({
  highestDegreeAttained: Joi.string(),
  uniInsName: Joi.string(),
  fieldOfStudy: Joi.string(),
  graduationYear: Joi.string().length(4),
});

/**
 * Schema for validating Skills and Expertise.
 *
 * @type {ObjectSchema}
 */
const skillsExpertise: ObjectSchema = Joi.object().keys({
  keySkills: Joi.array().items(Joi.string()),
  certificationsLicenses: Joi.array().items(Joi.string()),
});

/**
 * Schema for validating work history details.
 *
 * @type {ArraySchema}
 */
const workHistory: ArraySchema = Joi.array().items(
  Joi.object().keys({
    previousJobTitle: Joi.string(),
    companyName: Joi.string(),
    employmentDates: Joi.string(),
    responsibilitiesAchievements: Joi.string()
  })
);

/**
 * Schema for validating Preferences.
 *
 * @type {ObjectSchema}
 */
const preferences: ObjectSchema = Joi.object().keys({
  availabilityForReferrals: Joi.string(),
  jobPreferences: Joi.array().items(Joi.string()),
});

/**
 * Schema for validating Additional Information.
 *
 * @type {ObjectSchema}
 */
const additionalInfo: ObjectSchema = Joi.object().keys({
  personalBio: Joi.string().max(200),
});

/**
 * Schema for validating Social Links.
 *
 * @type {ObjectSchema}
 */
const socialLinks: ObjectSchema = Joi.object().keys({
  linkedInUrl: Joi.string(),
  gitHubUrl: Joi.string(),
  websiteUrl: Joi.string(),
});

/**
 * Schema for validating user details for posting.
 *
 * @type {ObjectSchema}
 */
const updateUserDetails: ObjectSchema = Joi.object().keys({
  personalInfo,
  professionalInfo,
  education,
  skillsExpertise,
  workHistory,
  preferences,
  additionalInfo,
  socialLinks,
});

export { getUserDetails, updateUserDetails };
