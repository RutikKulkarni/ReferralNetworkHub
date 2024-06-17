import httpStatus from "http-status";
import { UserModel, AccountDetailsModel } from "../models";
import { ApiError } from "../utils/ApiError";
import { UserDocument } from "../models/user.model";
import { AccountDetailsDocument } from "../models/userAccountDetails.model";

// Define a custom interface for the combined return value
interface RegistrationResult {
  userInfo: UserDocument;
  userAccountDetails: AccountDetailsDocument;
}

/**
 * Registers a new user.
 *
 * @param {UserDocument} userData - The user data to register.
 * @returns {Promise<RegistrationResult>} A promise that resolves with the registered user document.
 * @throws {ApiError} Throws an API error if registration fails.
 */
const registerUser = async (
  userData: UserDocument
): Promise<RegistrationResult> => {
  try {
    if (await findUserByEmail(userData.email)) {
      throw new ApiError(
        "The email address is already in use",
        httpStatus.BAD_REQUEST
      );
    }

    let user = new UserModel(userData);
    user.password = await user.hashPassword(user.password);
    saveDOc(user);
    let userAccountDetails = await AccountDetailsModel.create({
      _id: user._id,
    });
    return { userInfo: user, userAccountDetails };
  } catch (err: any) {
    throw new ApiError(
      "Failed to register, " + err.message,
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
const saveDOc = async (doc: UserDocument): Promise<UserDocument> =>
  await doc.save();

/**
 * Finds a user by email.
 *
 * @param {string} email - The email of the user to find.
 * @returns {Promise<UserDocument | null>} A promise that resolves with the user document if found, or null if not found.
 */
const findUserByEmail = async (email: string): Promise<UserDocument | null> =>
  await UserModel.findOne({ email });

/**
 * login a user.
 *
 * @param {string} email - email provided by user to login.
 * @param {string} password - password provided by user to login.
 * @returns {Promise<UserDocument>} A promise that resolves with the loggedIn user document.
 * @throws {ApiError} Throws an API error if login fails.
 */
const loginUser = async (
  email: string,
  password: string
): Promise<UserDocument> => {
  try {
    let user = await findUserByEmail(email);
    if (!user) {
      throw new ApiError(
        "User does not exist. Please register first.",
        httpStatus.BAD_REQUEST
      );
    }

    if (!(await user.comparePassword(password))) {
      throw new ApiError("Incorrect password", httpStatus.UNAUTHORIZED);
    }

    return user;
  } catch (err: any) {
    throw new ApiError(
      "Failed to log in, " + err.message,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export { registerUser, loginUser };
