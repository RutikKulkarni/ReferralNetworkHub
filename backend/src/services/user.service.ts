import { ApiError } from "../utils/ApiError";
import { AccountDetailsModel } from "../models";
import httpStatus from "http-status";
import { AccountDetailsDocument } from "../models/userAccountDetails.model";

/**
 * Get user details by user ID.
 *
 * @param {string} userId - The ID of the user to fetch details for.
 * @returns {Promise<AccountDetailsModel>} The user details.
 * @throws {ApiError} If the user is not found, throws a BAD_REQUEST error.
 */
const getDetailsById = async (userId: string) => {
  let user = await AccountDetailsModel.findById({ _id: userId });

  if (!user) {
    throw new ApiError("User not found", httpStatus.BAD_REQUEST);
  }

  return user;
};

/**
 * Interface representing user account details for posting.
 */
interface UserAccountDetails {
  personalDetails: AccountDetailsDocument["userDetails"]["personalDetails"]; // Personal details of the user.
  pastExperience: AccountDetailsDocument["userDetails"]["pastExperience"]; // Past experience details of the user.
  pastWorkHistory: AccountDetailsDocument["userDetails"]["pastWorkHistory"]; // Past work history details of the user.
  socialLinks: AccountDetailsDocument["userDetails"]["socialLinks"]; // Social links details of the user.
}

/**
 * Post user details for a specific user.
 *
 * @param {string} userId - The ID of the user to update details for.
 * @param {UserAccountDetails} details - The user account details to update.
 * @returns {Promise<AccountDetailsModel>} The updated user details.
 */
const postDetails = async (userId: string, details: UserAccountDetails) => {
  const updateSchema: UserAccountDetails = {
    personalDetails: details.personalDetails,
    pastExperience: details.pastExperience,
    pastWorkHistory: details.pastWorkHistory,
    socialLinks: details.socialLinks,
  };

  let user = await AccountDetailsModel.findOneAndUpdate(
    { _id: userId },
    { userDetails: updateSchema },
    { new: true }
  );

  return user;
};

export { getDetailsById, postDetails };
