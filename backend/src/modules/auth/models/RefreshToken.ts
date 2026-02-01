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
import { RefreshTokenAttributes } from "../../../shared/types";
import { User } from "./User";

export class RefreshToken
  extends Model<
    RefreshTokenAttributes,
    Optional<
      RefreshTokenAttributes,
      | "id"
      | "isRevoked"
      | "revokedAt"
      | "replacedByToken"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements RefreshTokenAttributes
{
  public id!: string;
  public userId!: string;
  public sessionId!: string;
  public token!: string;
  public expiresAt!: Date;
  public isRevoked!: boolean;
  public revokedAt!: Date | null;
  public replacedByToken!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, string>;
  public createUser!: BelongsToCreateAssociationMixin<User>;

  public static associations: {
    user: Association<RefreshToken, User>;
  };

  /**
   * Check if token is expired
   */
  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  /**
   * Check if token is valid
   */
  public isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }

  /**
   * Revoke token
   */
  public async revoke(replacedBy?: string): Promise<void> {
    this.isRevoked = true;
    this.revokedAt = new Date();
    if (replacedBy) {
      this.replacedByToken = replacedBy;
    }
    await this.save();
  }
}

export const initRefreshTokenModel = (
  sequelize: Sequelize,
): typeof RefreshToken => {
  RefreshToken.init(
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
      sessionId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isRevoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      replacedByToken: {
        type: DataTypes.TEXT,
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
      tableName: "refresh_tokens",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["token"],
        },
        {
          fields: ["user_id"],
        },
        {
          fields: ["expires_at"],
        },
        {
          fields: ["is_revoked"],
        },
        {
          fields: ["user_id", "is_revoked"],
        },
      ],
    },
  );

  return RefreshToken;
};
