import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";

/**
 * Interface representing a User document.
 * @interface UserDocument
 */
interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  _id: string;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string): Promise<boolean>;
}

/**
 * Mongoose schema for the User document.
 * @const {mongoose.Schema<UserDocument>}
 */
const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: function (email: string) {
        if (!validator.isEmail(email)) {
          throw new ApiError(
            "Invalid email format. Please provide a valid email address.",
            httpStatus.BAD_REQUEST
          );
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/**
 * Method to hash the user's password.
 * @method hashPassword
 * @memberof UserDocument
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} A promise that resolves with the hashed password.
 */
userSchema.methods.hashPassword = async function (
  password: string
): Promise<string> {
  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

/**
 * Method to compare user's hashed password.
 * @method comparePassword
 * @memberof UserDocument
 * @param {string} password - The password to compare.
 * @returns {Promise<boolean>} A promise that resolves with the comparison result.
 */
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  let user = this;
  return await bcrypt.compare(password, user.password);
};

/**
 * Mongoose model for the User document.
 * @const {Model<UserDocument>}
 */
const userModel: Model<UserDocument> = mongoose.model("User", userSchema);

export { userModel };
export { UserDocument };
