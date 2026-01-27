/**
 * User Session Model
 * Tracks active user sessions for session management
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
import { UserSessionAttributes } from "../../../shared/types";
import { SESSION_STATUS } from "../../../constants";
import { User } from "./User";

export class UserSession
  extends Model<
    UserSessionAttributes,
    Optional<
      UserSessionAttributes,
      | "id"
      | "status"
      | "lastActivityAt"
      | "logoutAt"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements UserSessionAttributes
{
  public id!: string;
  public userId!: string;
  public sessionToken!: string;
  public status!: string;
  public ipAddress!: string;
  public deviceType!: string;
  public browser!: string;
  public browserVersion!: string;
  public os!: string;
  public osVersion!: string;
  public userAgent!: string;
  public deviceId!: string;
  public loginAt!: Date;
  public lastActivityAt!: Date;
  public logoutAt!: Date | null;
  public expiresAt!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, string>;
  public createUser!: BelongsToCreateAssociationMixin<User>;

  public static associations: {
    user: Association<UserSession, User>;
  };

  /**
   * Check if session is expired
   */
  public isExpired(): boolean {
    return (
      new Date() > this.expiresAt || this.status === SESSION_STATUS.EXPIRED
    );
  }

  /**
   * Check if session is active
   */
  public isActive(): boolean {
    return this.status === SESSION_STATUS.ACTIVE && !this.isExpired();
  }

  /**
   * Update last activity
   */
  public async updateActivity(): Promise<void> {
    this.lastActivityAt = new Date();
    await this.save();
  }

  /**
   * Expire session
   */
  public async expire(): Promise<void> {
    this.status = SESSION_STATUS.EXPIRED;
    await this.save();
  }

  /**
   * Revoke session
   */
  public async revoke(): Promise<void> {
    this.status = SESSION_STATUS.REVOKED;
    await this.save();
  }

  /**
   * Logout session
   */
  public async logout(): Promise<void> {
    this.status = SESSION_STATUS.LOGGED_OUT;
    await this.save();
  }
}

export const initUserSessionModel = (
  sequelize: Sequelize,
): typeof UserSession => {
  UserSession.init(
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
      sessionToken: {
        type: DataTypes.STRING(500),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          isIn: [Object.values(SESSION_STATUS)],
        },
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: false,
      },
      deviceType: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      browser: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      browserVersion: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      os: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      osVersion: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      userAgent: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      deviceId: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      loginAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      lastActivityAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      logoutAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
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
      tableName: "user_sessions",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["session_token"],
        },
        {
          fields: ["user_id"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["expires_at"],
        },
        {
          fields: ["user_id", "status"],
        },
      ],
    },
  );

  return UserSession;
};
