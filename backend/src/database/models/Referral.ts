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
import { Job } from "./Job";

export interface ReferralAttributes {
  id: string;
  job_id: string;
  referrer_id: string;
  candidate_id: string;
  organization_id: string;
  referral_type: "internal" | "external";
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "application_submitted"
    | "hired"
    | "bonus_paid";
  referral_note: string | null;
  recruiter_reviewed_by: string | null;
  reviewed_at: Date | null;
  hired_date: Date | null;
  bonus_amount: number | null;
  bonus_paid_date: Date | null;
  rejection_reason: string | null;
  created_at: Date;
  updated_at: Date;
}

export class Referral
  extends Model<
    ReferralAttributes,
    Optional<
      ReferralAttributes,
      | "id"
      | "referral_type"
      | "status"
      | "referral_note"
      | "recruiter_reviewed_by"
      | "reviewed_at"
      | "hired_date"
      | "bonus_amount"
      | "bonus_paid_date"
      | "rejection_reason"
      | "created_at"
      | "updated_at"
    >
  >
  implements ReferralAttributes
{
  public id!: string;
  public job_id!: string;
  public referrer_id!: string;
  public candidate_id!: string;
  public organization_id!: string;
  public referral_type!: "internal" | "external";
  public status!:
    | "pending"
    | "accepted"
    | "rejected"
    | "application_submitted"
    | "hired"
    | "bonus_paid";
  public referral_note!: string | null;
  public recruiter_reviewed_by!: string | null;
  public reviewed_at!: Date | null;
  public hired_date!: Date | null;
  public bonus_amount!: number | null;
  public bonus_paid_date!: Date | null;
  public rejection_reason!: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations
  public readonly job?: Job;
  public readonly referrer?: User;
  public readonly candidate?: User;
  public readonly organization?: Organization;
  public readonly reviewer?: User;

  public getJob!: BelongsToGetAssociationMixin<Job>;
  public getReferrer!: BelongsToGetAssociationMixin<User>;
  public getCandidate!: BelongsToGetAssociationMixin<User>;
  public getOrganization!: BelongsToGetAssociationMixin<Organization>;
  public getReviewer!: BelongsToGetAssociationMixin<User>;

  public static associations: {
    job: Association<Referral, Job>;
    referrer: Association<Referral, User>;
    candidate: Association<Referral, User>;
    organization: Association<Referral, Organization>;
    reviewer: Association<Referral, User>;
  };

  /**
   * Accept referral
   */
  public async accept(reviewerId: string): Promise<void> {
    this.status = "accepted";
    this.recruiter_reviewed_by = reviewerId;
    this.reviewed_at = new Date();
    await this.save();
  }

  /**
   * Reject referral
   */
  public async reject(reviewerId: string, reason: string): Promise<void> {
    this.status = "rejected";
    this.recruiter_reviewed_by = reviewerId;
    this.reviewed_at = new Date();
    this.rejection_reason = reason;
    await this.save();
  }

  /**
   * Mark as application submitted
   */
  public async markApplicationSubmitted(): Promise<void> {
    if (this.status === "accepted") {
      this.status = "application_submitted";
      await this.save();
    }
  }

  /**
   * Mark candidate as hired
   */
  public async markHired(bonusAmount?: number): Promise<void> {
    this.status = "hired";
    this.hired_date = new Date();
    if (bonusAmount !== undefined) {
      this.bonus_amount = bonusAmount;
    }
    await this.save();
  }

  /**
   * Mark bonus as paid
   */
  public async markBonusPaid(): Promise<void> {
    if (this.status === "hired" && this.bonus_amount) {
      this.status = "bonus_paid";
      this.bonus_paid_date = new Date();
      await this.save();
    }
  }

  /**
   * Check if referral is pending review
   */
  public isPending(): boolean {
    return this.status === "pending";
  }

  /**
   * Check if referral bonus is payable
   */
  public isBonusPayable(): boolean {
    return (
      this.status === "hired" &&
      !!this.bonus_amount &&
      this.bonus_amount > 0 &&
      !this.bonus_paid_date
    );
  }
}

export const initReferralModel = (sequelize: Sequelize): typeof Referral => {
  Referral.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      referrer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "RESTRICT",
        comment: "User who provided the referral",
      },
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "RESTRICT",
        comment: "User being referred",
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
      referral_type: {
        type: DataTypes.ENUM("internal", "external"),
        allowNull: false,
        defaultValue: "external",
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "accepted",
          "rejected",
          "application_submitted",
          "hired",
          "bonus_paid",
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      referral_note: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Note from referrer about the candidate",
      },
      recruiter_reviewed_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        comment: "Recruiter or org admin who reviewed the referral",
      },
      reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      hired_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      bonus_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: "Referral bonus amount if candidate is hired",
      },
      bonus_paid_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: "referrals",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["job_id", "candidate_id"],
          name: "unique_job_candidate_referral",
        },
        {
          fields: ["job_id"],
        },
        {
          fields: ["referrer_id"],
        },
        {
          fields: ["candidate_id"],
        },
        {
          fields: ["organization_id"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["referral_type"],
        },
        {
          fields: ["recruiter_reviewed_by"],
        },
      ],
      scopes: {
        pending: {
          where: {
            status: "pending",
          },
        },
        accepted: {
          where: {
            status: "accepted",
          },
        },
        hired: {
          where: {
            status: "hired",
          },
        },
        bonusPayable: {
          where: {
            status: "hired",
            bonus_paid_date: null,
          },
        },
        byReferrer: (referrer_id: string) => ({
          where: {
            referrer_id,
          },
        }),
        byCandidate: (candidate_id: string) => ({
          where: {
            candidate_id,
          },
        }),
        byOrganization: (organization_id: string) => ({
          where: {
            organization_id,
          },
        }),
      },
    },
  );

  return Referral;
};
