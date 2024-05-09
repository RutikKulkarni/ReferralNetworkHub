import httpStatus from "http-status";
import { UserModel } from "../models";
import { ApiError } from "../utils/ApiError";
import { UserDocument } from "../models/user.model";

/**
 * Registers a new user.
 *
 * @param {UserDocument} userData - The user data to register.
 * @returns {Promise<UserDocument>} A promise that resolves with the registered user document.
 * @throws {ApiError} Throws an API error if registration fails.
 */
const registerUser = async (userData: UserDocument) => {
  try {
    if (await findUserByEmail(userData.email)) {
      throw new ApiError("Email already taken ", httpStatus.BAD_REQUEST);
    }

    let user = new UserModel(userData);
    user.password = await user.hashPassword(user.password);
    saveDOc(user);
    return user;
  } catch (err: any) {
    throw new ApiError(
      "Failed to register user, " + err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * Saves a document.
 *
 * @param {UserDocument} doc - The document to save.
 * @returns {Promise<UserDocument>} A promise that resolves with the saved document.
 */
const saveDOc = async (doc: UserDocument) => await doc.save();

/**
 * Finds a user by email.
 *
 * @param {string} email - The email of the user to find.
 * @returns {Promise<UserDocument | null>} A promise that resolves with the user document if found, or null if not found.
 */
const findUserByEmail = async (email: string) =>
  await UserModel.findOne({ email });

export { registerUser };
