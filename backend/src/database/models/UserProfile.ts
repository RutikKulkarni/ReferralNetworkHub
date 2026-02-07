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
  user_id: string;
  profile_type: "job_seeker" | "referral_provider" | "employee";
  bio: string | null;
  skills: string[] | null;
  experience_years: number | null;
  current_location: string | null;
  preferred_locations: string[] | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  education: Record<string, unknown>[] | null;
  work_experience: Record<string, unknown>[] | null;
  certifications: Record<string, unknown>[] | null;
  can_receive_referrals: boolean;
  can_provide_referrals: boolean;
  referrals_given: number;
  referrals_received: number;
  created_at: Date;
  updated_at: Date;
}

export class UserProfile
  extends Model<
    UserProfileAttributes,
    Optional<
      UserProfileAttributes,
      | "id"
      | "bio"
      | "skills"
      | "experience_years"
      | "current_location"
      | "preferred_locations"
      | "linkedin_url"
      | "github_url"
      | "portfolio_url"
      | "resume_url"
      | "education"
      | "work_experience"
      | "certifications"
      | "can_receive_referrals"
      | "can_provide_referrals"
      | "referrals_given"
      | "referrals_received"
      | "created_at"
      | "updated_at"
    >
  >
  implements UserProfileAttributes
{
  public id!: string;
  public user_id!: string;
  public profile_type!: "job_seeker" | "referral_provider" | "employee";
  public bio!: string | null;
  public skills!: string[] | null;
  public experience_years!: number | null;
  public current_location!: string | null;
  public preferred_locations!: string[] | null;
  public linkedin_url!: string | null;
  public github_url!: string | null;
  public portfolio_url!: string | null;
  public resume_url!: string | null;
  public education!: Record<string, unknown>[] | null;
  public work_experience!: Record<string, unknown>[] | null;
  public certifications!: Record<string, unknown>[] | null;
  public can_receive_referrals!: boolean;
  public can_provide_referrals!: boolean;
  public referrals_given!: number;
  public referrals_received!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

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
      this.experience_years,
      this.current_location,
      this.resume_url,
      this.work_experience?.length,
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
      !!this.resume_url &&
      !!this.skills &&
      this.skills.length > 0 &&
      this.experience_years !== null
    );
  }

  /**
   * Increment referrals given
   */
  public async incrementReferralsGiven(): Promise<void> {
    this.referrals_given += 1;
    await this.save();
  }

  /**
   * Increment referrals received
   */
  public async incrementReferralsReceived(): Promise<void> {
    this.referrals_received += 1;
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
      profile_type: {
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
      experience_years: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 0,
          max: 70,
        },
      },
      current_location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      preferred_locations: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      linkedin_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      github_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      portfolio_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      resume_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      education: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        comment: "Array of education objects with degree, institution, year",
      },
      work_experience: {
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
      can_receive_referrals: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      can_provide_referrals: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      referrals_given: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      referrals_received: {
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
      tableName: "user_profiles",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id"],
        },
        {
          fields: ["profile_type"],
        },
        {
          fields: ["current_location"],
        },
        {
          fields: ["experience_years"],
        },
      ],
      scopes: {
        jobSeekers: {
          where: {
            profile_type: "job_seeker",
          },
        },
        canReceiveReferrals: {
          where: {
            can_receive_referrals: true,
          },
        },
        applicationReady: {
          where: {
            resume_url: {
              [Op.ne]: null,
            },
          },
        },
      },
    },
  );

  return UserProfile;
};
