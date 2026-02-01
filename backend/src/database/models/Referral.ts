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
  jobId: string;
  referrerId: string;
  candidateId: string;
  organizationId: string;
  referralType: "internal" | "external";
  status:
    | "pending"
    | "accepted"
    | "rejected"
    | "application_submitted"
    | "hired"
    | "bonus_paid";
  referralNote: string | null;
  recruiterReviewedBy: string | null;
  reviewedAt: Date | null;
  hiredDate: Date | null;
  bonusAmount: number | null;
  bonusPaidDate: Date | null;
  rejectionReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Referral
  extends Model<
    ReferralAttributes,
    Optional<
      ReferralAttributes,
      | "id"
      | "referralType"
      | "status"
      | "referralNote"
      | "recruiterReviewedBy"
      | "reviewedAt"
      | "hiredDate"
      | "bonusAmount"
      | "bonusPaidDate"
      | "rejectionReason"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements ReferralAttributes
{
  public id!: string;
  public jobId!: string;
  public referrerId!: string;
  public candidateId!: string;
  public organizationId!: string;
  public referralType!: "internal" | "external";
  public status!:
    | "pending"
    | "accepted"
    | "rejected"
    | "application_submitted"
    | "hired"
    | "bonus_paid";
  public referralNote!: string | null;
  public recruiterReviewedBy!: string | null;
  public reviewedAt!: Date | null;
  public hiredDate!: Date | null;
  public bonusAmount!: number | null;
  public bonusPaidDate!: Date | null;
  public rejectionReason!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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
    this.recruiterReviewedBy = reviewerId;
    this.reviewedAt = new Date();
    await this.save();
  }

  /**
   * Reject referral
   */
  public async reject(reviewerId: string, reason: string): Promise<void> {
    this.status = "rejected";
    this.recruiterReviewedBy = reviewerId;
    this.reviewedAt = new Date();
    this.rejectionReason = reason;
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
    this.hiredDate = new Date();
    if (bonusAmount !== undefined) {
      this.bonusAmount = bonusAmount;
    }
    await this.save();
  }

  /**
   * Mark bonus as paid
   */
  public async markBonusPaid(): Promise<void> {
    if (this.status === "hired" && this.bonusAmount) {
      this.status = "bonus_paid";
      this.bonusPaidDate = new Date();
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
      !!this.bonusAmount &&
      this.bonusAmount > 0 &&
      !this.bonusPaidDate
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
      jobId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "jobs",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      referrerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "RESTRICT",
        comment: "User who provided the referral",
      },
      candidateId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "RESTRICT",
        comment: "User being referred",
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
      referralType: {
        type: DataTypes.ENUM("internal", "external"),
        allowNull: false,
        defaultValue: "external",
        comment:
          "Internal: candidate is employee of another org, External: candidate is job seeker",
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
      referralNote: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Note from referrer about the candidate",
      },
      recruiterReviewedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        comment: "Recruiter or org admin who reviewed the referral",
      },
      reviewedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      hiredDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      bonusAmount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
        comment: "Referral bonus amount if candidate is hired",
      },
      bonusPaidDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      rejectionReason: {
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
      tableName: "referrals",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["jobId", "candidateId"],
          name: "unique_job_candidate_referral",
        },
        {
          fields: ["jobId"],
        },
        {
          fields: ["referrerId"],
        },
        {
          fields: ["candidateId"],
        },
        {
          fields: ["organizationId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["referralType"],
        },
        {
          fields: ["recruiterReviewedBy"],
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
            bonusPaidDate: null,
          },
        },
        byReferrer: (referrerId: string) => ({
          where: {
            referrerId,
          },
        }),
        byCandidate: (candidateId: string) => ({
          where: {
            candidateId,
          },
        }),
        byOrganization: (organizationId: string) => ({
          where: {
            organizationId,
          },
        }),
      },
    },
  );

  return Referral;
};
