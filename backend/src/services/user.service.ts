import { ApiError } from "../utils/ApiError";
import { AccountDetailsModel } from "../models";
import httpStatus from "http-status";
import { AccountDetailsDocument } from "../models/userAccountDetails.model";

/**
 * Get user details by user ID.
 *
 * @param {string} userId - The ID of the user to fetch details for.
 * @returns {Promise<AccountDetailsDocument>} The user details.
 * @throws {ApiError} If the user is not found, throws a BAD_REQUEST error.
 */
const getDetailsById = async (userId: string): Promise<AccountDetailsDocument | null> => {
  const user = await AccountDetailsModel.findById(userId);

  if (!user) {
    throw new ApiError("User not found", httpStatus.BAD_REQUEST);
  }

  return user;
};

/**
 * Interface representing user account details for posting.
 */
interface UserAccountDetails {
  personalInfo: AccountDetailsDocument["userDetails"]["personalInfo"]; // Personal details of the user.
  professionalInfo: AccountDetailsDocument["userDetails"]["professionalInfo"]; // Professional information of the user.
  education: AccountDetailsDocument["userDetails"]["education"]; // Education information of the user.
  skillsExpertise: AccountDetailsDocument["userDetails"]["skillsExpertise"]; // Skills and expertise of the user.
  workHistory: AccountDetailsDocument["userDetails"]["workHistory"]; // Work history of the user.
  preferences: AccountDetailsDocument["userDetails"]["preferences"]; // Job preferences of the user.
  additionalInfo: AccountDetailsDocument["userDetails"]["additionalInfo"]; // Additional information about the user.
  socialLinks: AccountDetailsDocument["userDetails"]["socialLinks"]; // Social links of the user.
}

/**
 * Post user details for a specific user.
 *
 * @param {string} userId - The ID of the user to update details for.
 * @param {UserAccountDetails} details - The user account details to update.
 * @returns {Promise<AccountDetailsDocument | null>} The updated user details.
 */
const postDetails = async (userId: string, details: UserAccountDetails): Promise<AccountDetailsDocument | null> => {
  const updateSchema: UserAccountDetails = {
    personalInfo: details.personalInfo,
    professionalInfo: details.professionalInfo,
    education: details.education,
    skillsExpertise: details.skillsExpertise,
    workHistory: details.workHistory,
    preferences: details.preferences,
    additionalInfo: details.additionalInfo,
    socialLinks: details.socialLinks,
  };

  const user = await AccountDetailsModel.findOneAndUpdate(
    { _id: userId },
    { userDetails: updateSchema },
    { new: true }
  );

  return user;
};

export { getDetailsById, postDetails };
