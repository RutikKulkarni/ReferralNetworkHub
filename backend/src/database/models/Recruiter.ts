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

export interface RecruiterAttributes {
  id: string;
  user_id: string;
  organization_id: string;
  jobTitle: string | null;
  department: string | null;
  canPostJobs: boolean;
  canManageReferrals: boolean;
  hiredDate: Date | null;
  is_active: boolean;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export class Recruiter
  extends Model<
    RecruiterAttributes,
    Optional<
      RecruiterAttributes,
      | "id"
      | "jobTitle"
      | "department"
      | "canPostJobs"
      | "canManageReferrals"
      | "hiredDate"
      | "is_active"
      | "created_by"
      | "created_at"
      | "updated_at"
    >
  >
  implements RecruiterAttributes
{
  public id!: string;
  public user_id!: string;
  public organization_id!: string;
  public jobTitle!: string | null;
  public department!: string | null;
  public canPostJobs!: boolean;
  public canManageReferrals!: boolean;
  public hiredDate!: Date | null;
  public is_active!: boolean;
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
    user: Association<Recruiter, User>;
    organization: Association<Recruiter, Organization>;
    creator: Association<Recruiter, User>;
  };

  /**
   * Check if recruiter has permission to post jobs
   */
  public hasJobPostingPermission(): boolean {
    return this.is_active && this.canPostJobs;
  }

  /**
   * Check if recruiter has permission to manage referrals
   */
  public hasReferralManagementPermission(): boolean {
    return this.is_active && this.canManageReferrals;
  }
}

export const initRecruiterModel = (sequelize: Sequelize): typeof Recruiter => {
  Recruiter.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
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
      jobTitle: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      canPostJobs: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      canManageReferrals: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      hiredDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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
      tableName: "recruiters",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id"],
          name: "recruiters_user_id_unique",
        },
        {
          fields: ["organization_id"],
          name: "recruiters_organization_id_idx",
        },
        {
          fields: ["is_active"],
        },
        {
          fields: ["department"],
        },
      ],
      scopes: {
        active: {
          where: {
            is_active: true,
          },
        },
        canPostJobs: {
          where: {
            is_active: true,
            canPostJobs: true,
          },
        },
        byOrganization: (organization_id: string) => ({
          where: {
            organization_id,
          },
        }),
      },
    },
  );

  return Recruiter;
};
