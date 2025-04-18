import mongoose, { type Document, Schema } from "mongoose"

export interface IPasswordReset extends Document {
  email: string
  token: string
  createdAt: Date
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
)

// Token expires after 10 minutes
PasswordResetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 10 * 60 })

export default mongoose.model<IPasswordReset>("PasswordReset", PasswordResetSchema)
