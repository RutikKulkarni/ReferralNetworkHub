import mongoose, { type Document, Schema } from "mongoose"

export interface IUser extends Document {
  email: string
  password: string
  role: "user" | "recruiter" | "admin"
  firstName: string
  lastName: string
  companyName?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "recruiter", "admin"],
      default: "user",
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      // Required only for recruiters, handled in controller
    },
  },
  { timestamps: true },
)

export default mongoose.model<IUser>("User", UserSchema)
