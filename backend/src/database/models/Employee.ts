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
  user_id: string;
  organization_id: string;
  job_title: string;
  department: string | null;
  employee_id: string | null;
  manager_id: string | null;
  joined_date: Date;
  is_currently_employed: boolean;
  left_date: Date | null;
  offboard_reason: string | null;
  can_provide_referrals: boolean;
  referral_count: number;
  performance_rating: number | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export class Employee
  extends Model<
    EmployeeAttributes,
    Optional<
      EmployeeAttributes,
      | "id"
      | "department"
      | "employee_id"
      | "manager_id"
      | "is_currently_employed"
      | "left_date"
      | "offboard_reason"
      | "can_provide_referrals"
      | "referral_count"
      | "performance_rating"
      | "notes"
      | "created_at"
      | "updated_at"
    >
  >
  implements EmployeeAttributes
{
  public id!: string;
  public user_id!: string;
  public organization_id!: string;
  public job_title!: string;
  public department!: string | null;
  public employee_id!: string | null;
  public manager_id!: string | null;
  public joined_date!: Date;
  public is_currently_employed!: boolean;
  public left_date!: Date | null;
  public offboard_reason!: string | null;
  public can_provide_referrals!: boolean;
  public referral_count!: number;
  public performance_rating!: number | null;
  public notes!: string | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;

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
    this.is_currently_employed = false;
    this.left_date = leftDate || new Date();
    this.offboard_reason = reason;
    this.can_provide_referrals = false;
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
      this.job_title = newJobTitle;
    }
    await this.save();
  }

  /**
   * Assign manager
   */
  public async assignManager(managerId: string): Promise<void> {
    this.manager_id = managerId;
    await this.save();
  }

  /**
   * Update performance rating
   */
  public async updatePerformance(rating: number): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error("Performance rating must be between 1 and 5");
    }
    this.performance_rating = rating;
    await this.save();
  }

  /**
   * Increment referral count
   */
  public async incrementReferrals(): Promise<void> {
    this.referral_count += 1;
    await this.save();
  }

  /**
   * Check if employee can provide referrals
   */
  public canRefer(): boolean {
    return this.is_currently_employed && this.can_provide_referrals;
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      job_title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      employee_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "Company-specific employee identifier",
      },
      manager_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      joined_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      is_currently_employed: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      left_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      offboard_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      can_provide_referrals: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      referral_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      performance_rating: {
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
      tableName: "employees",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "organization_id"],
          name: "unique_user_organization_employee",
        },
        {
          fields: ["user_id"],
        },
        {
          fields: ["organization_id"],
        },
        {
          fields: ["is_currently_employed"],
        },
        {
          fields: ["department"],
        },
        {
          fields: ["manager_id"],
        },
        {
          fields: ["employee_id"],
        },
      ],
      scopes: {
        active: {
          where: {
            is_currently_employed: true,
          },
        },
        byDepartment: (department: string) => ({
          where: {
            department,
            is_currently_employed: true,
          },
        }),
        canRefer: {
          where: {
            is_currently_employed: true,
            can_provide_referrals: true,
          },
        },
        byOrganization: (organization_id: string) => ({
          where: {
            organization_id,
          },
        }),
      },
    },
  );

  return Employee;
};
