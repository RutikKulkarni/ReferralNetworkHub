import mongoose, { Document, Model } from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";

/**
 * Interface representing a User document.
 */
interface UserDocument extends Document{
  name: string;
  email: string;
  password: string;
  _id : string
  hashPassword(password : string):Promise<string>
}

/**
 * Mongoose schema for the User document.
 * @const {mongoose.Schema<UserDocument>}
 */
const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate : function(email:string){
      if(!validator.isEmail(email)){
        throw new ApiError('Invalid email format!', httpStatus.BAD_REQUEST)
      }
    }
  },
  password: {
    type: String,
    required: true,
  },
});

/**
 * Method to hash the user's password.
 * @method hashPassword
 * @memberof UserDocument
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} A promise that resolves with the hashed password.
 */
userSchema.methods.hashPassword = async function(password:string):Promise<string>{
  let salt = await bcrypt.genSalt(10)
  let hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

/**
 * Mongoose model for the User document.
 * @const {Model<UserDocument>}
 */
const userModel:Model<UserDocument> = mongoose.model("User", userSchema);

export { userModel };
export {UserDocument}
