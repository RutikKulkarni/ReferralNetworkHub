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
import { InviteTokenAttributes } from "../../../shared/types";
import { INVITE_STATUS, INVITE_TYPES } from "../../../constants";
import { User } from "./User";

export class InviteToken
  extends Model<
    InviteTokenAttributes,
    Optional<
      InviteTokenAttributes,
      | "id"
      | "status"
      | "organizationId"
      | "role"
      | "acceptedAt"
      | "acceptedBy"
      | "revokedAt"
      | "revokedBy"
      | "metadata"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements InviteTokenAttributes
{
  public id!: string;
  public inviteType!: string;
  public email!: string;
  public token!: string;
  public status!: string;
  public organizationId!: string | null;
  public invitedBy!: string;
  public role!: string | null;
  public expiresAt!: Date;
  public acceptedAt!: Date | null;
  public acceptedBy!: string | null;
  public revokedAt!: Date | null;
  public revokedBy!: string | null;
  public metadata!: Record<string, unknown> | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly inviter?: User;
  public readonly acceptedByUser?: User;

  public getInviter!: BelongsToGetAssociationMixin<User>;
  public setInviter!: BelongsToSetAssociationMixin<User, string>;
  public createInviter!: BelongsToCreateAssociationMixin<User>;

  public static associations: {
    inviter: Association<InviteToken, User>;
    acceptedByUser: Association<InviteToken, User>;
  };

  /**
   * Check if invite is expired
   */
  public isExpired(): boolean {
    return new Date() > this.expiresAt || this.status === INVITE_STATUS.EXPIRED;
  }

  /**
   * Check if invite is valid
   */
  public isValid(): boolean {
    return (
      this.status === INVITE_STATUS.PENDING &&
      !this.isExpired() &&
      this.revokedAt === null
    );
  }

  /**
   * Accept invite
   */
  public async accept(userId: string): Promise<void> {
    this.status = INVITE_STATUS.ACCEPTED;
    this.acceptedAt = new Date();
    this.acceptedBy = userId;
    await this.save();
  }

  /**
   * Revoke invite
   */
  public async revoke(userId: string): Promise<void> {
    this.status = INVITE_STATUS.REVOKED;
    this.revokedAt = new Date();
    this.revokedBy = userId;
    await this.save();
  }

  /**
   * Expire invite
   */
  public async expire(): Promise<void> {
    this.status = INVITE_STATUS.EXPIRED;
    await this.save();
  }

  /**
   * Get invite details for email
   */
  public getInviteDetails(): {
    type: string;
    email: string;
    organizationId: string | null;
    role: string | null;
  } {
    return {
      type: this.inviteType,
      email: this.email,
      organizationId: this.organizationId,
      role: this.role,
    };
  }
}

export const initInviteTokenModel = (
  sequelize: Sequelize,
): typeof InviteToken => {
  InviteToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      inviteType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isIn: [Object.values(INVITE_TYPES)],
        },
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
        defaultValue: INVITE_STATUS.PENDING,
        allowNull: false,
        validate: {
          isIn: [Object.values(INVITE_STATUS)],
        },
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      invitedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      acceptedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      acceptedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      revokedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      metadata: {
        type: DataTypes.JSONB,
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
      tableName: "invite_tokens",
      timestamps: true,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["token"],
        },
        {
          fields: ["email"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["invite_type"],
        },
        {
          fields: ["organization_id"],
        },
        {
          fields: ["invited_by"],
        },
        {
          fields: ["expires_at"],
        },
        {
          fields: ["email", "status"],
        },
      ],
    },
  );

  return InviteToken;
};
