import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("recruiters", {
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
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      specializations: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      total_jobs_posted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      total_hires: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      total_referrals_received: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      average_time_to_hire_days: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      can_post_jobs: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      can_review_referrals: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      left_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.addIndex("recruiters", ["user_id"], {
      unique: true,
      name: "recruiters_user_id_unique",
    });

    await queryInterface.addIndex("recruiters", ["organization_id"], {
      name: "recruiters_organization_id_idx",
    });

    await queryInterface.addIndex("recruiters", ["is_active"], {
      name: "recruiters_is_active_idx",
    });

    await queryInterface.addIndex("recruiters", ["department"], {
      name: "recruiters_department_idx",
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("recruiters");
  },
};
