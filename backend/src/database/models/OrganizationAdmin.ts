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
  user_id: string;
  organization_id: string;
  role: "owner" | "admin" | "viewer";
  permissions: Record<string, boolean> | null;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export class OrganizationAdmin
  extends Model<
    OrganizationAdminAttributes,
    Optional<
      OrganizationAdminAttributes,
      "id" | "role" | "permissions" | "created_by" | "created_at" | "updated_at"
    >
  >
  implements OrganizationAdminAttributes
{
  public id!: string;
  public user_id!: string;
  public organization_id!: string;
  public role!: "owner" | "admin" | "viewer";
  public permissions!: Record<string, boolean> | null;
  public created_by!: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      organization_id: {
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
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
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
          fields: ["user_id", "organization_id"],
          name: "organization_admins_user_org_unique",
        },
        {
          fields: ["user_id"],
          name: "organization_admins_user_id_idx",
        },
        {
          fields: ["organization_id"],
          name: "organization_admins_organization_id_idx",
        },
        {
          fields: ["role"],
        },
      ],
    },
  );

  return OrganizationAdmin;
};
