import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  Association,
  BelongsToGetAssociationMixin,
  HasManyGetAssociationsMixin,
} from "sequelize";
import { User } from "../../modules/auth/models/User";
import { Organization } from "./Organization";

export interface JobAttributes {
  id: string;
  organizationId: string;
  postedBy: string;
  title: string;
  description: string;
  requirements: Record<string, unknown> | null;
  location: string | null;
  jobType: "full_time" | "part_time" | "contract" | "internship";
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  salaryRangeMin: number | null;
  salaryRangeMax: number | null;
  currency: string;
  skillsRequired: string[] | null;
  benefits: string[] | null;
  isActive: boolean;
  isReferralEligible: boolean;
  referralBonus: number | null;
  applicationDeadline: Date | null;
  postedDate: Date;
  closedDate: Date | null;
  closedReason: string | null;
  viewCount: number;
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Job
  extends Model<
    JobAttributes,
    Optional<
      JobAttributes,
      | "id"
      | "requirements"
      | "location"
      | "salaryRangeMin"
      | "salaryRangeMax"
      | "currency"
      | "skillsRequired"
      | "benefits"
      | "isActive"
      | "isReferralEligible"
      | "referralBonus"
      | "applicationDeadline"
      | "postedDate"
      | "closedDate"
      | "closedReason"
      | "viewCount"
      | "applicationCount"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements JobAttributes
{
  public id!: string;
  public organizationId!: string;
  public postedBy!: string;
  public title!: string;
  public description!: string;
  public requirements!: Record<string, unknown> | null;
  public location!: string | null;
  public jobType!: "full_time" | "part_time" | "contract" | "internship";
  public experienceLevel!: "entry" | "mid" | "senior" | "lead";
  public salaryRangeMin!: number | null;
  public salaryRangeMax!: number | null;
  public currency!: string;
  public skillsRequired!: string[] | null;
  public benefits!: string[] | null;
  public isActive!: boolean;
  public isReferralEligible!: boolean;
  public referralBonus!: number | null;
  public applicationDeadline!: Date | null;
  public postedDate!: Date;
  public closedDate!: Date | null;
  public closedReason!: string | null;
  public viewCount!: number;
  public applicationCount!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly organization?: Organization;
  public readonly recruiter?: User;

  public getOrganization!: BelongsToGetAssociationMixin<Organization>;
  public getRecruiter!: BelongsToGetAssociationMixin<User>;
  public getApplications!: HasManyGetAssociationsMixin<unknown>;
  public getReferrals!: HasManyGetAssociationsMixin<unknown>;

  public static associations: {
    organization: Association<Job, Organization>;
    recruiter: Association<Job, User>;
    applications: Association<Job, Model>;
    referrals: Association<Job, Model>;
  };

  /**
   * Close job posting
   */
  public async close(reason: string): Promise<void> {
    this.isActive = false;
    this.closedDate = new Date();
    this.closedReason = reason;
    await this.save();
  }

  /**
   * Reopen job posting
   */
  public async reopen(): Promise<void> {
    this.isActive = true;
    this.closedDate = null;
    this.closedReason = null;
    await this.save();
  }

  /**
   * Increment view count
   */
  public async incrementViews(): Promise<void> {
    this.viewCount += 1;
    await this.save();
  }

  /**
   * Increment application count
   */
  public async incrementApplications(): Promise<void> {
    this.applicationCount += 1;
    await this.save();
  }

  /**
   * Check if job is accepting applications
   */
  public isAcceptingApplications(): boolean {
    if (!this.isActive) return false;
    if (this.applicationDeadline && this.applicationDeadline < new Date()) {
      return false;
    }
    return true;
  }

  /**
   * Check if job is eligible for referrals
   */
  public canReceiveReferrals(): boolean {
    return this.isActive && this.isReferralEligible;
  }
}

export const initJobModel = (sequelize: Sequelize): typeof Job => {
  Job.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      postedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "RESTRICT",
        comment: "Recruiter who posted the job",
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      requirements: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Detailed job requirements",
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      jobType: {
        type: DataTypes.ENUM(
          "full_time",
          "part_time",
          "contract",
          "internship",
        ),
        allowNull: false,
        defaultValue: "full_time",
      },
      experienceLevel: {
        type: DataTypes.ENUM("entry", "mid", "senior", "lead"),
        allowNull: false,
        defaultValue: "mid",
      },
      salaryRangeMin: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      salaryRangeMax: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: "USD",
        allowNull: false,
      },
      skillsRequired: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      benefits: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      isReferralEligible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      referralBonus: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: "Bonus amount for successful referrals",
      },
      applicationDeadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      postedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      closedDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      closedReason: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      viewCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      applicationCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      tableName: "jobs",
      timestamps: true,
      indexes: [
        {
          fields: ["organizationId"],
        },
        {
          fields: ["postedBy"],
        },
        {
          fields: ["isActive"],
        },
        {
          fields: ["postedDate"],
        },
        {
          fields: ["jobType"],
        },
        {
          fields: ["experienceLevel"],
        },
        {
          fields: ["location"],
        },
      ],
      scopes: {
        active: {
          where: {
            isActive: true,
          },
        },
        referralEligible: {
          where: {
            isActive: true,
            isReferralEligible: true,
          },
        },
        byOrganization: (organizationId: string) => ({
          where: {
            organizationId,
          },
        }),
        byRecruiter: (postedBy: string) => ({
          where: {
            postedBy,
          },
        }),
        byJobType: (jobType: string) => ({
          where: {
            jobType,
            isActive: true,
          },
        }),
      },
    },
  );

  return Job;
};
