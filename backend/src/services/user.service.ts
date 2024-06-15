import { ApiError } from "../utils/ApiError";
import { AccountDetailsModel } from "../models";
import httpStatus from "http-status";

/**
 * Get user details by user ID.
 *
 * @param {string} userId - The ID of the user to fetch details for.
 * @returns {Promise<AccountDetailsModel>} The user details.
 * @throws {ApiError} If the user is not found, throws a BAD_REQUEST error.
 */
const getUserDetailsById = async (userId: string) => {
  let user = await AccountDetailsModel.findById({ _id: userId });

  if (!user) {
    throw new ApiError("User not found", httpStatus.BAD_REQUEST);
  }

  return user;
};

export { getUserDetailsById };
