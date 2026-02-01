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

export interface UserProfileAttributes {
  id: string;
  userId: string;
  profileType: "job_seeker" | "referral_provider" | "employee";
  bio: string | null;
  skills: string[] | null;
  experienceYears: number | null;
  currentLocation: string | null;
  preferredLocations: string[] | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  resumeUrl: string | null;
  education: Record<string, unknown>[] | null;
  workExperience: Record<string, unknown>[] | null;
  certifications: Record<string, unknown>[] | null;
  canReceiveReferrals: boolean;
  canProvideReferrals: boolean;
  referralsGiven: number;
  referralsReceived: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfile
  extends Model<
    UserProfileAttributes,
    Optional<
      UserProfileAttributes,
      | "id"
      | "bio"
      | "skills"
      | "experienceYears"
      | "currentLocation"
      | "preferredLocations"
      | "linkedinUrl"
      | "githubUrl"
      | "portfolioUrl"
      | "resumeUrl"
      | "education"
      | "workExperience"
      | "certifications"
      | "canReceiveReferrals"
      | "canProvideReferrals"
      | "referralsGiven"
      | "referralsReceived"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements UserProfileAttributes
{
  public id!: string;
  public userId!: string;
  public profileType!: "job_seeker" | "referral_provider" | "employee";
  public bio!: string | null;
  public skills!: string[] | null;
  public experienceYears!: number | null;
  public currentLocation!: string | null;
  public preferredLocations!: string[] | null;
  public linkedinUrl!: string | null;
  public githubUrl!: string | null;
  public portfolioUrl!: string | null;
  public resumeUrl!: string | null;
  public education!: Record<string, unknown>[] | null;
  public workExperience!: Record<string, unknown>[] | null;
  public certifications!: Record<string, unknown>[] | null;
  public canReceiveReferrals!: boolean;
  public canProvideReferrals!: boolean;
  public referralsGiven!: number;
  public referralsReceived!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;

  public getUser!: BelongsToGetAssociationMixin<User>;

  public static associations: {
    user: Association<UserProfile, User>;
  };

  /**
   * Calculate profile completeness percentage
   */
  public getCompleteness(): number {
    let completed = 0;
    const fields = [
      this.bio,
      this.skills?.length,
      this.experienceYears,
      this.currentLocation,
      this.resumeUrl,
      this.workExperience?.length,
    ];

    fields.forEach((field) => {
      if (field) completed++;
    });

    return Math.round((completed / fields.length) * 100);
  }

  /**
   * Check if profile is complete enough for applications
   */
  public isApplicationReady(): boolean {
    return (
      !!this.resumeUrl &&
      !!this.skills &&
      this.skills.length > 0 &&
      this.experienceYears !== null
    );
  }

  /**
   * Increment referrals given
   */
  public async incrementReferralsGiven(): Promise<void> {
    this.referralsGiven += 1;
    await this.save();
  }

  /**
   * Increment referrals received
   */
  public async incrementReferralsReceived(): Promise<void> {
    this.referralsReceived += 1;
    await this.save();
  }
}

export const initUserProfileModel = (
  sequelize: Sequelize,
): typeof UserProfile => {
  UserProfile.init(
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
      profileType: {
        type: DataTypes.ENUM("job_seeker", "referral_provider", "employee"),
        allowNull: false,
        defaultValue: "job_seeker",
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      skills: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      experienceYears: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 70,
        },
      },
      currentLocation: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      preferredLocations: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      linkedinUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      githubUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      portfolioUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      resumeUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      education: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        comment: "Array of education objects with degree, institution, year",
      },
      workExperience: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        comment:
          "Array of work experience objects with company, role, duration",
      },
      certifications: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        comment: "Array of certification objects with name, issuer, date",
      },
      canReceiveReferrals: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      canProvideReferrals: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      referralsGiven: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      referralsReceived: {
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
      tableName: "user_profiles",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId"],
        },
        {
          fields: ["profileType"],
        },
        {
          fields: ["currentLocation"],
        },
        {
          fields: ["experienceYears"],
        },
      ],
      scopes: {
        jobSeekers: {
          where: {
            profileType: "job_seeker",
          },
        },
        canReceiveReferrals: {
          where: {
            canReceiveReferrals: true,
          },
        },
        applicationReady: {
          where: {
            resumeUrl: {
              [Op.ne]: null,
            },
          },
        },
      },
    },
  );

  return UserProfile;
};
