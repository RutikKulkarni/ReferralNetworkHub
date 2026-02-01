import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("employees", {
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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      organization_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "organizations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      employee_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      designation: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      employment_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      employment_status: {
        type: DataTypes.STRING(50),
        defaultValue: "active",
        allowNull: false,
      },
      work_location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      manager_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "employees",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      date_of_joining: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      date_of_leaving: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      probation_end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_probation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      salary_currency: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      salary_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      salary_frequency: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      can_refer: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      total_referrals_made: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      successful_referrals: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      total_bonus_earned: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        defaultValue: {},
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
    });

    // Create indexes
    await queryInterface.addIndex("employees", ["user_id", "organization_id"], {
      name: "employees_user_org_idx",
    });

    await queryInterface.addIndex("employees", ["organization_id"], {
      name: "employees_organization_id_idx",
    });

    await queryInterface.addIndex("employees", ["employee_id"], {
      name: "employees_employee_id_idx",
    });

    await queryInterface.addIndex("employees", ["employment_status"], {
      name: "employees_employment_status_idx",
    });

    await queryInterface.addIndex("employees", ["manager_id"], {
      name: "employees_manager_id_idx",
    });

    await queryInterface.addIndex("employees", ["department"], {
      name: "employees_department_idx",
    });

    await queryInterface.addIndex("employees", ["can_refer"], {
      name: "employees_can_refer_idx",
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("employees");
  },
};
