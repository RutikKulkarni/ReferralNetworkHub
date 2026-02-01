import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  Association,
  BelongsToGetAssociationMixin,
  Op,
} from "sequelize";
import { User } from "../../modules/auth/models/User";
import { Organization } from "./Organization";
import { Job } from "./Job";
import { Referral } from "./Referral";

export interface ApplicationAttributes {
  id: string;
  jobId: string;
  applicantId: string;
  referralId: string | null;
  organizationId: string;
  applicationStatus:
    | "submitted"
    | "screening"
    | "interview"
    | "offer"
    | "hired"
    | "rejected"
    | "withdrawn";
  resumeUrl: string | null;
  coverLetter: string | null;
  appliedDate: Date;
  reviewedBy: string | null;
  lastUpdatedBy: string | null;
  rejectionReason: string | null;
  offerDetails: Record<string, unknown> | null;
  hiredDate: Date | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Application
  extends Model<
    ApplicationAttributes,
    Optional<
      ApplicationAttributes,
      | "id"
      | "referralId"
      | "applicationStatus"
      | "resumeUrl"
      | "coverLetter"
      | "appliedDate"
      | "reviewedBy"
      | "lastUpdatedBy"
      | "rejectionReason"
      | "offerDetails"
      | "hiredDate"
      | "notes"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements ApplicationAttributes
{
  public id!: string;
  public jobId!: string;
  public applicantId!: string;
  public referralId!: string | null;
  public organizationId!: string;
  public applicationStatus!:
    | "submitted"
    | "screening"
    | "interview"
    | "offer"
    | "hired"
    | "rejected"
    | "withdrawn";
  public resumeUrl!: string | null;
  public coverLetter!: string | null;
  public appliedDate!: Date;
  public reviewedBy!: string | null;
  public lastUpdatedBy!: string | null;
  public rejectionReason!: string | null;
  public offerDetails!: Record<string, unknown> | null;
  public hiredDate!: Date | null;
  public notes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly job?: Job;
  public readonly applicant?: User;
  public readonly referral?: Referral;
  public readonly organization?: Organization;
  public readonly reviewer?: User;

  public getJob!: BelongsToGetAssociationMixin<Job>;
  public getApplicant!: BelongsToGetAssociationMixin<User>;
  public getReferral!: BelongsToGetAssociationMixin<Referral>;
  public getOrganization!: BelongsToGetAssociationMixin<Organization>;
  public getReviewer!: BelongsToGetAssociationMixin<User>;

  public static associations: {
    job: Association<Application, Job>;
    applicant: Association<Application, User>;
    referral: Association<Application, Referral>;
    organization: Association<Application, Organization>;
    reviewer: Association<Application, User>;
  };

  /**
   * Move application to screening stage
   */
  public async moveToScreening(reviewerId: string): Promise<void> {
    this.applicationStatus = "screening";
    this.reviewedBy = reviewerId;
    this.lastUpdatedBy = reviewerId;
    await this.save();
  }

  /**
   * Move application to interview stage
   */
  public async moveToInterview(updatedBy: string): Promise<void> {
    if (this.applicationStatus === "screening") {
      this.applicationStatus = "interview";
      this.lastUpdatedBy = updatedBy;
      await this.save();
    }
  }

  /**
   * Send offer to candidate
   */
  public async sendOffer(
    updatedBy: string,
    offerDetails: Record<string, unknown>,
  ): Promise<void> {
    if (this.applicationStatus === "interview") {
      this.applicationStatus = "offer";
      this.offerDetails = offerDetails;
      this.lastUpdatedBy = updatedBy;
      await this.save();
    }
  }

  /**
   * Mark candidate as hired
   */
  public async markHired(updatedBy: string): Promise<void> {
    if (this.applicationStatus === "offer") {
      this.applicationStatus = "hired";
      this.hiredDate = new Date();
      this.lastUpdatedBy = updatedBy;
      await this.save();
    }
  }

  /**
   * Reject application
   */
  public async reject(updatedBy: string, reason: string): Promise<void> {
    this.applicationStatus = "rejected";
    this.rejectionReason = reason;
    this.lastUpdatedBy = updatedBy;
    await this.save();
  }

  /**
   * Withdraw application (by applicant)
   */
  public async withdraw(): Promise<void> {
    if (
      this.applicationStatus !== "hired" &&
      this.applicationStatus !== "rejected"
    ) {
      this.applicationStatus = "withdrawn";
      await this.save();
    }
  }

  /**
   * Check if application was referred
   */
  public isReferred(): boolean {
    return !!this.referralId;
  }

  /**
   * Check if application is in active pipeline
   */
  public isInPipeline(): boolean {
    const terminalStatuses: ApplicationAttributes["applicationStatus"][] = [
      "rejected",
      "withdrawn",
      "hired",
    ];
    return !terminalStatuses.includes(this.applicationStatus);
  }

  /**
   * Add notes to application
   */
  public async addNotes(notes: string, updatedBy: string): Promise<void> {
    this.notes = this.notes ? `${this.notes}\n\n${notes}` : notes;
    this.lastUpdatedBy = updatedBy;
    await this.save();
  }
}

export const initApplicationModel = (
  sequelize: Sequelize,
): typeof Application => {
  Application.init(
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
      applicantId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      referralId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "referrals",
          key: "id",
        },
        onDelete: "SET NULL",
        comment: "Associated referral if application came through referral",
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
      applicationStatus: {
        type: DataTypes.ENUM(
          "submitted",
          "screening",
          "interview",
          "offer",
          "hired",
          "rejected",
          "withdrawn",
        ),
        allowNull: false,
        defaultValue: "submitted",
      },
      resumeUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      coverLetter: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      appliedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      reviewedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        comment: "Recruiter or org admin who first reviewed",
      },
      lastUpdatedBy: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        comment: "Last person who updated application status",
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      offerDetails: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Offer details including salary, benefits, start date",
      },
      hiredDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Internal notes about the application",
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
      tableName: "applications",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["jobId", "applicantId"],
          name: "unique_job_applicant_application",
        },
        {
          fields: ["jobId"],
        },
        {
          fields: ["applicantId"],
        },
        {
          fields: ["referralId"],
        },
        {
          fields: ["organizationId"],
        },
        {
          fields: ["applicationStatus"],
        },
        {
          fields: ["appliedDate"],
        },
        {
          fields: ["reviewedBy"],
        },
      ],
      scopes: {
        submitted: {
          where: {
            applicationStatus: "submitted",
          },
        },
        screening: {
          where: {
            applicationStatus: "screening",
          },
        },
        interview: {
          where: {
            applicationStatus: "interview",
          },
        },
        offered: {
          where: {
            applicationStatus: "offer",
          },
        },
        hired: {
          where: {
            applicationStatus: "hired",
          },
        },
        rejected: {
          where: {
            applicationStatus: "rejected",
          },
        },
        inPipeline: {
          where: {
            applicationStatus: [
              "submitted",
              "screening",
              "interview",
              "offer",
            ] as const,
          },
        },
        referred: {
          where: {
            referralId: {
              [Op.ne]: null,
            },
          },
        },
        byJob: (jobId: string) => ({
          where: {
            jobId,
          },
        }),
        byApplicant: (applicantId: string) => ({
          where: {
            applicantId,
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

  return Application;
};
