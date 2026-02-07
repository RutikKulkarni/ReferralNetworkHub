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
  job_id: string;
  applicant_id: string;
  referral_id: string | null;
  organization_id: string;
  application_status:
    | "submitted"
    | "screening"
    | "interview"
    | "offer"
    | "hired"
    | "rejected"
    | "withdrawn";
  resume_url: string | null;
  cover_letter: string | null;
  applied_date: Date;
  reviewed_by: string | null;
  last_updated_by: string | null;
  rejection_reason: string | null;
  offer_details: Record<string, unknown> | null;
  hired_date: Date | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export class Application
  extends Model<
    ApplicationAttributes,
    Optional<
      ApplicationAttributes,
      | "id"
      | "referral_id"
      | "application_status"
      | "resume_url"
      | "cover_letter"
      | "applied_date"
      | "reviewed_by"
      | "last_updated_by"
      | "rejection_reason"
      | "offer_details"
      | "hired_date"
      | "notes"
      | "created_at"
      | "updated_at"
    >
  >
  implements ApplicationAttributes
{
  public id!: string;
  public job_id!: string;
  public applicant_id!: string;
  public referral_id!: string | null;
  public organization_id!: string;
  public application_status!:
    | "submitted"
    | "screening"
    | "interview"
    | "offer"
    | "hired"
    | "rejected"
    | "withdrawn";
  public resume_url!: string | null;
  public cover_letter!: string | null;
  public applied_date!: Date;
  public reviewed_by!: string | null;
  public last_updated_by!: string | null;
  public rejection_reason!: string | null;
  public offer_details!: Record<string, unknown> | null;
  public hired_date!: Date | null;
  public notes!: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

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
    this.application_status = "screening";
    this.reviewed_by = reviewerId;
    this.last_updated_by = reviewerId;
    await this.save();
  }

  /**
   * Move application to interview stage
   */
  public async moveToInterview(updatedBy: string): Promise<void> {
    if (this.application_status === "screening") {
      this.application_status = "interview";
      this.last_updated_by = updatedBy;
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
    if (this.application_status === "interview") {
      this.application_status = "offer";
      this.offer_details = offerDetails;
      this.last_updated_by = updatedBy;
      await this.save();
    }
  }

  /**
   * Mark candidate as hired
   */
  public async markHired(updatedBy: string): Promise<void> {
    if (this.application_status === "offer") {
      this.application_status = "hired";
      this.hired_date = new Date();
      this.last_updated_by = updatedBy;
      await this.save();
    }
  }

  /**
   * Reject application
   */
  public async reject(updatedBy: string, reason: string): Promise<void> {
    this.application_status = "rejected";
    this.rejection_reason = reason;
    this.last_updated_by = updatedBy;
    await this.save();
  }

  /**
   * Withdraw application (by applicant)
   */
  public async withdraw(): Promise<void> {
    if (
      this.application_status !== "hired" &&
      this.application_status !== "rejected"
    ) {
      this.application_status = "withdrawn";
      await this.save();
    }
  }

  /**
   * Check if application was referred
   */
  public isReferred(): boolean {
    return !!this.referral_id;
  }

  /**
   * Check if application is in active pipeline
   */
  public isInPipeline(): boolean {
    const terminalStatuses: ApplicationAttributes["application_status"][] = [
      "rejected",
      "withdrawn",
      "hired",
    ];
    return !terminalStatuses.includes(this.application_status);
  }

  /**
   * Add notes to application
   */
  public async addNotes(notes: string, updatedBy: string): Promise<void> {
    this.notes = this.notes ? `${this.notes}\n\n${notes}` : notes;
    this.last_updated_by = updatedBy;
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
      applicant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      referral_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "referrals",
          key: "id",
        },
        onDelete: "SET NULL",
        comment: "Associated referral if application came through referral",
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
      application_status: {
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
      resume_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      cover_letter: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      applied_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      reviewed_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        comment: "Recruiter or org admin who first reviewed",
      },
      last_updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
        comment: "Last person who updated application status",
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      offer_details: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: "Offer details including salary, benefits, start date",
      },
      hired_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Internal notes about the application",
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
      tableName: "applications",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["job_id", "applicant_id"],
          name: "unique_job_applicant_application",
        },
        {
          fields: ["job_id"],
        },
        {
          fields: ["applicant_id"],
        },
        {
          fields: ["referral_id"],
        },
        {
          fields: ["organization_id"],
        },
        {
          fields: ["application_status"],
        },
        {
          fields: ["applied_date"],
        },
        {
          fields: ["reviewed_by"],
        },
      ],
      scopes: {
        submitted: {
          where: {
            application_status: "submitted",
          },
        },
        screening: {
          where: {
            application_status: "screening",
          },
        },
        interview: {
          where: {
            application_status: "interview",
          },
        },
        offered: {
          where: {
            application_status: "offer",
          },
        },
        hired: {
          where: {
            application_status: "hired",
          },
        },
        rejected: {
          where: {
            application_status: "rejected",
          },
        },
        inPipeline: {
          where: {
            application_status: [
              "submitted",
              "screening",
              "interview",
              "offer",
            ] as const,
          },
        },
        referred: {
          where: {
            referral_id: {
              [Op.ne]: null,
            },
          },
        },
        byJob: (job_id: string) => ({
          where: {
            job_id,
          },
        }),
        byApplicant: (applicant_id: string) => ({
          where: {
            applicant_id,
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

  return Application;
};
