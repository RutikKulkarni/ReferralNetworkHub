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

export interface EmployeeAttributes {
  id: string;
  userId: string;
  organizationId: string;
  jobTitle: string;
  department: string | null;
  employeeId: string | null;
  managerId: string | null;
  joinedDate: Date;
  isCurrentlyEmployed: boolean;
  leftDate: Date | null;
  offboardReason: string | null;
  canProvideReferrals: boolean;
  referralCount: number;
  performanceRating: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Employee
  extends Model<
    EmployeeAttributes,
    Optional<
      EmployeeAttributes,
      | "id"
      | "department"
      | "employeeId"
      | "managerId"
      | "isCurrentlyEmployed"
      | "leftDate"
      | "offboardReason"
      | "canProvideReferrals"
      | "referralCount"
      | "performanceRating"
      | "notes"
      | "createdAt"
      | "updatedAt"
    >
  >
  implements EmployeeAttributes
{
  public id!: string;
  public userId!: string;
  public organizationId!: string;
  public jobTitle!: string;
  public department!: string | null;
  public employeeId!: string | null;
  public managerId!: string | null;
  public joinedDate!: Date;
  public isCurrentlyEmployed!: boolean;
  public leftDate!: Date | null;
  public offboardReason!: string | null;
  public canProvideReferrals!: boolean;
  public referralCount!: number;
  public performanceRating!: number | null;
  public notes!: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: User;
  public readonly organization?: Organization;
  public readonly manager?: Employee;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public getOrganization!: BelongsToGetAssociationMixin<Organization>;
  public getManager!: BelongsToGetAssociationMixin<Employee>;

  public static associations: {
    user: Association<Employee, User>;
    organization: Association<Employee, Organization>;
    manager: Association<Employee, Employee>;
  };

  /**
   * Offboard employee
   */
  public async offboard(reason: string, leftDate?: Date): Promise<void> {
    this.isCurrentlyEmployed = false;
    this.leftDate = leftDate || new Date();
    this.offboardReason = reason;
    this.canProvideReferrals = false;
    await this.save();
  }

  /**
   * Change employee department
   */
  public async changeDepartment(
    newDepartment: string,
    newJobTitle?: string,
  ): Promise<void> {
    this.department = newDepartment;
    if (newJobTitle) {
      this.jobTitle = newJobTitle;
    }
    await this.save();
  }

  /**
   * Assign manager
   */
  public async assignManager(managerId: string): Promise<void> {
    this.managerId = managerId;
    await this.save();
  }

  /**
   * Update performance rating
   */
  public async updatePerformance(rating: number): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error("Performance rating must be between 1 and 5");
    }
    this.performanceRating = rating;
    await this.save();
  }

  /**
   * Increment referral count
   */
  public async incrementReferrals(): Promise<void> {
    this.referralCount += 1;
    await this.save();
  }

  /**
   * Check if employee can provide referrals
   */
  public canRefer(): boolean {
    return this.isCurrentlyEmployed && this.canProvideReferrals;
  }
}

export const initEmployeeModel = (sequelize: Sequelize): typeof Employee => {
  Employee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
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
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      employeeId: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "Company-specific employee identifier",
      },
      managerId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      joinedDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      isCurrentlyEmployed: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      leftDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      offboardReason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      canProvideReferrals: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      referralCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      performanceRating: {
        type: DataTypes.DECIMAL(2, 1),
        allowNull: true,
        validate: {
          min: 1.0,
          max: 5.0,
        },
        comment: "Performance rating from 1.0 to 5.0",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Internal notes about the employee",
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
      tableName: "employees",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["userId", "organizationId"],
          name: "unique_user_organization_employee",
        },
        {
          fields: ["userId"],
        },
        {
          fields: ["organizationId"],
        },
        {
          fields: ["isCurrentlyEmployed"],
        },
        {
          fields: ["department"],
        },
        {
          fields: ["managerId"],
        },
        {
          fields: ["employeeId"],
        },
      ],
      scopes: {
        active: {
          where: {
            isCurrentlyEmployed: true,
          },
        },
        byDepartment: (department: string) => ({
          where: {
            department,
            isCurrentlyEmployed: true,
          },
        }),
        canRefer: {
          where: {
            isCurrentlyEmployed: true,
            canProvideReferrals: true,
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

  return Employee;
};
