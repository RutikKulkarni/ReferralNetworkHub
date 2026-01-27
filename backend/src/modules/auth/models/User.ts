/**
 * User Model
 * Represents all user types in the system
 */

import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from "sequelize";
import { UserAttributes } from "../../../shared/types";
import { USER_TYPES, EMAIL_VERIFICATION_STATUS } from "../../../constants";
import { UserSession } from "./UserSession";
import { RefreshToken } from "./RefreshToken";

export class User
  extends Model<
    UserAttributes,
    Optional<
      UserAttributes,
      | "id"
      | "isActive"
      | "isBlocked"
      | "emailVerified"
      | "emailVerificationStatus"
      | "lastLoginAt"
      | "tokenVersion"
      | "oauthProvider"
      | "oauthProviderId"
      | "profilePicture"
      | "phone"
      | "organizationId"
      | "invitedBy"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements UserAttributes
{
  public id!: string;
  public userType!: string;
  public email!: string;
  public password!: string | null;
  public firstName!: string;
  public lastName!: string;
  public phone!: string | null;
  public profilePicture!: string | null;
  public isActive!: boolean;
  public isBlocked!: boolean;
  public blockReason!: string | null;
  public blockedAt!: Date | null;
  public blockedBy!: string | null;
  public emailVerified!: boolean;
  public emailVerificationStatus!: string;
  public lastLoginAt!: Date | null;
  public tokenVersion!: number;
  public oauthProvider!: string | null;
  public oauthProviderId!: string | null;
  public organizationId!: string | null;
  public invitedBy!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly sessions?: UserSession[];
  public readonly refreshTokens?: RefreshToken[];

  public getSessions!: HasManyGetAssociationsMixin<UserSession>;
  public addSession!: HasManyAddAssociationMixin<UserSession, string>;
  public hasSession!: HasManyHasAssociationMixin<UserSession, string>;
  public countSessions!: HasManyCountAssociationsMixin;
  public createSession!: HasManyCreateAssociationMixin<UserSession>;

  public getRefreshTokens!: HasManyGetAssociationsMixin<RefreshToken>;
  public addRefreshToken!: HasManyAddAssociationMixin<RefreshToken, string>;
  public hasRefreshToken!: HasManyHasAssociationMixin<RefreshToken, string>;
  public countRefreshTokens!: HasManyCountAssociationsMixin;
  public createRefreshToken!: HasManyCreateAssociationMixin<RefreshToken>;

  public static associations: {
    sessions: Association<User, UserSession>;
    refreshTokens: Association<User, RefreshToken>;
  };

  /**
   * Get full name
   */
  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Check if user can be logged in
   */
  public canLogin(): { allowed: boolean; reason?: string } {
    if (!this.isActive) {
      return { allowed: false, reason: "Account is inactive" };
    }

    if (this.isBlocked) {
      return { allowed: false, reason: "Account is blocked" };
    }

    if (
      !this.emailVerified &&
      this.userType === USER_TYPES.ORGANIZATION_ADMIN
    ) {
      return { allowed: false, reason: "Email verification required" };
    }

    return { allowed: true };
  }

  /**
   * Check if user requires session tracking
   */
  public requiresSessionTracking(): boolean {
    return this.userType !== USER_TYPES.PLATFORM_SUPER_ADMIN;
  }

  /**
   * Increment token version (invalidates all existing tokens)
   */
  public async invalidateAllTokens(): Promise<void> {
    this.tokenVersion += 1;
    await this.save();
  }

  /**
   * Convert to safe JSON (removes sensitive data)
   */
  public toSafeJSON(): Omit<UserAttributes, "password"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeUser } =
      this.toJSON() as UserAttributes;
    return safeUser;
  }
}

export const initUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isIn: [Object.values(USER_TYPES)],
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true, // Null for OAuth users
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      profilePicture: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      blockReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      blockedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      blockedBy: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      emailVerificationStatus: {
        type: DataTypes.STRING(20),
        defaultValue: EMAIL_VERIFICATION_STATUS.PENDING,
        allowNull: false,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      tokenVersion: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      oauthProvider: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      oauthProviderId: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      invitedBy: {
        type: DataTypes.UUID,
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
      tableName: "users",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
        {
          fields: ["user_type"],
        },
        {
          fields: ["organization_id"],
        },
        {
          fields: ["is_active", "is_blocked"],
        },
        {
          fields: ["oauth_provider", "oauth_provider_id"],
        },
      ],
    },
  );

  return User;
};
