import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
} from "sequelize";

export interface OrganizationAttributes {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  industry: string | null;
  size: string | null;
  logo: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  isActive: boolean;
  isVerified: boolean;
  verifiedAt: Date | null;
  settings: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Organization
  extends Model<
    OrganizationAttributes,
    Optional<
      OrganizationAttributes,
      | "id"
      | "description"
      | "website"
      | "industry"
      | "size"
      | "logo"
      | "address"
      | "city"
      | "state"
      | "country"
      | "zipCode"
      | "contactEmail"
      | "contactPhone"
      | "isActive"
      | "isVerified"
      | "verifiedAt"
      | "settings"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements OrganizationAttributes
{
  public id!: string;
  public name!: string;
  public description!: string | null;
  public website!: string | null;
  public industry!: string | null;
  public size!: string | null;
  public logo!: string | null;
  public address!: string | null;
  public city!: string | null;
  public state!: string | null;
  public country!: string | null;
  public zipCode!: string | null;
  public contactEmail!: string | null;
  public contactPhone!: string | null;
  public isActive!: boolean;
  public isVerified!: boolean;
  public verifiedAt!: Date | null;
  public settings!: Record<string, unknown> | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association mixins
  public getAdmins!: HasManyGetAssociationsMixin<unknown>;
  public addAdmin!: HasManyAddAssociationMixin<unknown, string>;
  public countAdmins!: HasManyCountAssociationsMixin;

  public getRecruiters!: HasManyGetAssociationsMixin<unknown>;
  public countRecruiters!: HasManyCountAssociationsMixin;

  public getEmployees!: HasManyGetAssociationsMixin<unknown>;
  public countEmployees!: HasManyCountAssociationsMixin;

  public getJobs!: HasManyGetAssociationsMixin<unknown>;
  public countJobs!: HasManyCountAssociationsMixin;

  public countApplications!: HasManyCountAssociationsMixin;
  public countReferrals!: HasManyCountAssociationsMixin;

  public static associations: {
    admins: Association<Organization, Model>;
    recruiters: Association<Organization, Model>;
    employees: Association<Organization, Model>;
    jobs: Association<Organization, Model>;
    referrals: Association<Organization, Model>;
    applications: Association<Organization, Model>;
  };
}

export const initOrganizationModel = (
  sequelize: Sequelize,
): typeof Organization => {
  Organization.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 255],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(500),
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      industry: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      size: {
        type: DataTypes.ENUM(
          "1-10",
          "11-50",
          "51-200",
          "201-500",
          "501-1000",
          "1000+",
        ),
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      contactEmail: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
      contactPhone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      verifiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      settings: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
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
      tableName: "organizations",
      timestamps: true,
      indexes: [
        {
          fields: ["name"],
        },
        {
          fields: ["is_active"],
        },
        {
          fields: ["is_verified"],
        },
        {
          fields: ["created_at"],
        },
      ],
      scopes: {
        active: {
          where: {
            isActive: true,
          },
        },
        verified: {
          where: {
            isVerified: true,
          },
        },
        activeAndVerified: {
          where: {
            isActive: true,
            isVerified: true,
          },
        },
      },
    },
  );

  return Organization;
};
