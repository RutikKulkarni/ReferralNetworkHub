import Joi, { ObjectSchema } from "joi";
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
 * Schema for validating personal details.
 *
 * @type {ObjectSchema}
 */
const personalDetails: ObjectSchema = Joi.object().keys({
  fullName: Joi.string(),
  email: Joi.string().email(),
  gender: Joi.string(),
  resume: Joi.string(),
  location: Joi.string(),
  phoneNumber: Joi.number(),
});

/**
 * Schema for validating past experience details.
 *
 * @type {ObjectSchema}
 */
const pastExperience: ObjectSchema = Joi.object().keys({
  currentJobTitle: Joi.string(),
  companyName: Joi.string(),
  industry: Joi.string(),
  yearsOfExperience: Joi.number(),
  highestDegreeAttained: Joi.string(),
  universityInstitutionName: Joi.string(),
  fieldOfStudy: Joi.string(),
  graduationYear: Joi.number(),
  keySkills: Joi.array(),
  certificationsLicenses: Joi.array(),
});

/**
 * Schema for validating past work history details.
 *
 * @type {ObjectSchema}
 */
const pastWorkHistory: ObjectSchema = Joi.object().keys({
  previousJobTitle: Joi.string(),
  companyName: Joi.string(),
  employmentDates: Joi.string(),
  responsiblitiesAchievements: Joi.array(),
  personalBioSummary: Joi.string(),
  availablityReferrals: Joi.string(),
  jobPreferences: Joi.string(),
});

/**
 * Schema for validating social links.
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
const postUserDetails: ObjectSchema = Joi.object().keys({
  personalDetails,
  pastExperience,
  pastWorkHistory,
  socialLinks,
});

export { getUserDetails, postUserDetails };
