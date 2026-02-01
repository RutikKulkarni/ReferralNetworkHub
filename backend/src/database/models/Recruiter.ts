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
  userId: string;
  organizationId: string;
  jobTitle: string | null;
  department: string | null;
  canPostJobs: boolean;
  canManageReferrals: boolean;
  hiredDate: Date | null;
  isActive: boolean;
  createdBy: string | null;
  createdAt: Date;
  updatedAt: Date;
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
      | "isActive"
      | "createdBy"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements RecruiterAttributes
{
  public id!: string;
  public userId!: string;
  public organizationId!: string;
  public jobTitle!: string | null;
  public department!: string | null;
  public canPostJobs!: boolean;
  public canManageReferrals!: boolean;
  public hiredDate!: Date | null;
  public isActive!: boolean;
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
    user: Association<Recruiter, User>;
    organization: Association<Recruiter, Organization>;
    creator: Association<Recruiter, User>;
  };

  /**
   * Check if recruiter has permission to post jobs
   */
  public hasJobPostingPermission(): boolean {
    return this.isActive && this.canPostJobs;
  }

  /**
   * Check if recruiter has permission to manage referrals
   */
  public hasReferralManagementPermission(): boolean {
    return this.isActive && this.canManageReferrals;
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
      userId: {
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
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
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
      tableName: "recruiters",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId"],
          name: "unique_recruiter_user",
        },
        {
          fields: ["organizationId"],
        },
        {
          fields: ["isActive"],
        },
        {
          fields: ["department"],
        },
      ],
      scopes: {
        active: {
          where: {
            isActive: true,
          },
        },
        canPostJobs: {
          where: {
            isActive: true,
            canPostJobs: true,
          },
        },
        byOrganization: (organizationId: string) => ({
          where: {
            organizationId,
          },
        }),
      },
    },
  );

  return Recruiter;
};
