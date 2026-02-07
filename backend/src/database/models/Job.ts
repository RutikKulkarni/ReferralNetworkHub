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
  organization_id: string;
  posted_by: string;
  title: string;
  description: string;
  requirements: Record<string, unknown> | null;
  location: string | null;
  job_type: "full_time" | "part_time" | "contract" | "internship";
  experience_level: "entry" | "mid" | "senior" | "lead";
  salary_range_min: number | null;
  salary_range_max: number | null;
  currency: string;
  skills_required: string[] | null;
  benefits: string[] | null;
  is_active: boolean;
  is_referral_eligible: boolean;
  referral_bonus: number | null;
  application_deadline: Date | null;
  posted_date: Date;
  closed_date: Date | null;
  closed_reason: string | null;
  view_count: number;
  application_count: number;
  created_at: Date;
  updated_at: Date;
}

export class Job
  extends Model<
    JobAttributes,
    Optional<
      JobAttributes,
      | "id"
      | "requirements"
      | "location"
      | "salary_range_min"
      | "salary_range_max"
      | "currency"
      | "skills_required"
      | "benefits"
      | "is_active"
      | "is_referral_eligible"
      | "referral_bonus"
      | "application_deadline"
      | "posted_date"
      | "closed_date"
      | "closed_reason"
      | "view_count"
      | "application_count"
      | "created_at"
      | "updated_at"
    >
  >
  implements JobAttributes
{
  public id!: string;
  public organization_id!: string;
  public posted_by!: string;
  public title!: string;
  public description!: string;
  public requirements!: Record<string, unknown> | null;
  public location!: string | null;
  public job_type!: "full_time" | "part_time" | "contract" | "internship";
  public experience_level!: "entry" | "mid" | "senior" | "lead";
  public salary_range_min!: number | null;
  public salary_range_max!: number | null;
  public currency!: string;
  public skills_required!: string[] | null;
  public benefits!: string[] | null;
  public is_active!: boolean;
  public is_referral_eligible!: boolean;
  public referral_bonus!: number | null;
  public application_deadline!: Date | null;
  public posted_date!: Date;
  public closed_date!: Date | null;
  public closed_reason!: string | null;
  public view_count!: number;
  public application_count!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

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
    this.is_active = false;
    this.closed_date = new Date();
    this.closed_reason = reason;
    await this.save();
  }

  /**
   * Reopen job posting
   */
  public async reopen(): Promise<void> {
    this.is_active = true;
    this.closed_date = null;
    this.closed_reason = null;
    await this.save();
  }

  /**
   * Increment view count
   */
  public async incrementViews(): Promise<void> {
    this.view_count += 1;
    await this.save();
  }

  /**
   * Increment application count
   */
  public async incrementApplications(): Promise<void> {
    this.application_count += 1;
    await this.save();
  }

  /**
   * Check if job is accepting applications
   */
  public isAcceptingApplications(): boolean {
    if (!this.is_active) return false;
    if (this.application_deadline && this.application_deadline < new Date()) {
      return false;
    }
    return true;
  }

  /**
   * Check if job is eligible for referrals
   */
  public canReceiveReferrals(): boolean {
    return this.is_active && this.is_referral_eligible;
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
      posted_by: {
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
      job_type: {
        type: DataTypes.ENUM(
          "full_time",
          "part_time",
          "contract",
          "internship",
        ),
        allowNull: false,
        defaultValue: "full_time",
      },
      experience_level: {
        type: DataTypes.ENUM("entry", "mid", "senior", "lead"),
        allowNull: false,
        defaultValue: "mid",
      },
      salary_range_min: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      salary_range_max: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      currency: {
        type: DataTypes.STRING(3),
        defaultValue: "USD",
        allowNull: false,
      },
      skills_required: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      benefits: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      is_referral_eligible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      referral_bonus: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: "Bonus amount for successful referrals",
      },
      application_deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      posted_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      closed_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      closed_reason: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      application_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
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
      tableName: "jobs",
      timestamps: true,
      indexes: [
        {
          fields: ["organization_id"],
        },
        {
          fields: ["posted_by"],
        },
        {
          fields: ["is_active"],
        },
        {
          fields: ["posted_date"],
        },
        {
          fields: ["job_type"],
        },
        {
          fields: ["experience_level"],
        },
        {
          fields: ["location"],
        },
      ],
      scopes: {
        active: {
          where: {
            is_active: true,
          },
        },
        referralEligible: {
          where: {
            is_active: true,
            is_referral_eligible: true,
          },
        },
        byOrganization: (organization_id: string) => ({
          where: {
            organization_id,
          },
        }),
        byRecruiter: (posted_by: string) => ({
          where: {
            posted_by,
          },
        }),
        byJobType: (job_type: string) => ({
          where: {
            job_type,
            is_active: true,
          },
        }),
      },
    },
  );

  return Job;
};
