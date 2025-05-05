import mongoose, { type Document, Schema } from "mongoose";

export interface IRefreshToken extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Token expires after 7 days
RefreshTokenSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60 }
);

export default mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema
);
