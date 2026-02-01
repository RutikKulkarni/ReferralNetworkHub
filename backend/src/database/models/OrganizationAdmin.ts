import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  Association,
  BelongsToGetAssociationMixin,
} from "sequelize";
import { User } from "../../modules/auth/models/User";
import { Organization } from "./Organization";

export interface OrganizationAdminAttributes {
  id: string;
  userId: string;
  organizationId: string;
  role: "owner" | "admin" | "viewer";
  permissions: Record<string, boolean> | null;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class OrganizationAdmin
  extends Model<
    OrganizationAdminAttributes,
    Optional<
      OrganizationAdminAttributes,
      "id" | "role" | "permissions" | "createdBy" | "createdAt" | "updatedAt"
    >
  >
  implements OrganizationAdminAttributes
{
  public id!: string;
  public userId!: string;
  public organizationId!: string;
  public role!: "owner" | "admin" | "viewer";
  public permissions!: Record<string, boolean> | null;
  public createdBy!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;
  public readonly organization?: Organization;
  public readonly creator?: User;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public getOrganization!: BelongsToGetAssociationMixin<Organization>;
  public getCreator!: BelongsToGetAssociationMixin<User>;

  public static associations: {
    user: Association<OrganizationAdmin, User>;
    organization: Association<OrganizationAdmin, Organization>;
    creator: Association<OrganizationAdmin, User>;
  };

  /**
   * Check if admin has owner role
   */
  public isOwner(): boolean {
    return this.role === "owner";
  }

  /**
   * Check if admin can manage other admins
   */
  public canManageAdmins(): boolean {
    return this.role === "owner";
  }

  /**
   * Check if admin has specific permission
   */
  public hasPermission(permission: string): boolean {
    if (this.role === "owner") return true;
    if (this.role === "viewer") return false;
    if (!this.permissions) return true; // Default admin has all permissions
    return this.permissions[permission] === true;
  }
}

export const initOrganizationAdminModel = (
  sequelize: Sequelize,
): typeof OrganizationAdmin => {
  OrganizationAdmin.init(
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
        onUpdate: "CASCADE",
      },
      organizationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "organizations",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      role: {
        type: DataTypes.ENUM("owner", "admin", "viewer"),
        allowNull: false,
        defaultValue: "admin",
      },
      permissions: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Granular permissions for custom access control",
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
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
      tableName: "organization_admins",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId", "organizationId"],
          name: "unique_user_organization_admin",
        },
        {
          fields: ["userId"],
        },
        {
          fields: ["organizationId"],
        },
        {
          fields: ["role"],
        },
      ],
    },
  );

  return OrganizationAdmin;
};
