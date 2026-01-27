/**
 * Password Reset Model
 * Manages password reset tokens
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
import { PasswordResetAttributes } from "../../../shared/types";
import { User } from "./User";

export class PasswordReset
  extends Model<
    PasswordResetAttributes,
    Optional<
      PasswordResetAttributes,
      "id" | "isUsed" | "usedAt" | "createdAt" | "updatedAt"
    >
  >
  implements PasswordResetAttributes
{
  public id!: string;
  public userId!: string;
  public email!: string;
  public token!: string;
  public expiresAt!: Date;
  public isUsed!: boolean;
  public usedAt!: Date | null;
  public ipAddress!: string;
  public userAgent!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, string>;
  public createUser!: BelongsToCreateAssociationMixin<User>;

  public static associations: {
    user: Association<PasswordReset, User>;
  };

  /**
   * Check if reset token is expired
   */
  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Check if reset token is valid
   */
  public isValid(): boolean {
    return !this.isUsed && !this.isExpired();
  }

  /**
   * Mark as used
   */
  public async markAsUsed(): Promise<void> {
    this.isUsed = true;
    this.usedAt = new Date();
    await this.save();
  }
}

export const initPasswordResetModel = (
  sequelize: Sequelize,
): typeof PasswordReset => {
  PasswordReset.init(
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
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      tableName: "password_resets",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["resetToken"],
        },
        {
          fields: ["userId"],
        },
        {
          fields: ["email"],
        },
        {
          fields: ["expiresAt"],
        },
        {
          fields: ["isUsed"],
        },
        {
          fields: ["userId", "isUsed"],
        },
      ],
    },
  );

  return PasswordReset;
};
