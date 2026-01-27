/**
 * Email Verification Model
 * Manages email verification tokens
 */

import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  Association,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
} from "sequelize";
import { EmailVerificationAttributes } from "../../../shared/types";
import { EMAIL_VERIFICATION_STATUS } from "../../../constants";
import { User } from "./User";

export class EmailVerification
  extends Model<
    EmailVerificationAttributes,
    Optional<
      EmailVerificationAttributes,
      "id" | "status" | "verifiedAt" | "createdAt" | "updatedAt"
    >
  >
  implements EmailVerificationAttributes
{
  public id!: string;
  public userId!: string;
  public email!: string;
  public token!: string;
  public status!: string;
  public expiresAt!: Date;
  public verifiedAt!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, string>;
  public createUser!: BelongsToCreateAssociationMixin<User>;

  public static associations: {
    user: Association<EmailVerification, User>;
  };

  /**
   * Check if verification token is expired
   */
  public isExpired(): boolean {
    return (
      new Date() > this.expiresAt ||
      this.status === EMAIL_VERIFICATION_STATUS.EXPIRED
    );
  }

  /**
   * Check if verification is valid
   */
  public isValid(): boolean {
    return (
      this.status === EMAIL_VERIFICATION_STATUS.PENDING && !this.isExpired()
    );
  }

  /**
   * Verify email
   */
  public async verify(): Promise<void> {
    this.status = EMAIL_VERIFICATION_STATUS.VERIFIED;
    this.verifiedAt = new Date();
    await this.save();
  }

  /**
   * Expire verification
   */
  public async expire(): Promise<void> {
    this.status = EMAIL_VERIFICATION_STATUS.EXPIRED;
    await this.save();
  }
}

export const initEmailVerificationModel = (
  sequelize: Sequelize,
): typeof EmailVerification => {
  EmailVerification.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      token: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: EMAIL_VERIFICATION_STATUS.PENDING,
        allowNull: false,
        validate: {
          isIn: [Object.values(EMAIL_VERIFICATION_STATUS)],
        },
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "email_verifications",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["verificationToken"],
        },
        {
          fields: ["userId"],
        },
        {
          fields: ["email"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["expiresAt"],
        },
        {
          fields: ["userId", "status"],
        },
      ],
    },
  );

  return EmailVerification;
};
