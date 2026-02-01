import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("organizations", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      industry: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      company_size: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      headquarters: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      founded_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verified_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      subscription_tier: {
        type: DataTypes.STRING(50),
        defaultValue: "free",
        allowNull: false,
      },
      subscription_status: {
        type: DataTypes.STRING(50),
        defaultValue: "trial",
        allowNull: false,
      },
      subscription_started_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      subscription_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      monthly_job_posts_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        allowNull: false,
      },
      monthly_job_posts_used: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      deactivated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deactivation_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      settings: {
        type: DataTypes.JSONB,
        defaultValue: {},
        allowNull: false,
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
    await queryInterface.addIndex("organizations", ["slug"], {
      unique: true,
      name: "organizations_slug_unique",
    });

    await queryInterface.addIndex("organizations", ["is_active"], {
      name: "organizations_is_active_idx",
    });

    await queryInterface.addIndex("organizations", ["is_verified"], {
      name: "organizations_is_verified_idx",
    });

    await queryInterface.addIndex("organizations", ["subscription_tier"], {
      name: "organizations_subscription_tier_idx",
    });

    await queryInterface.addIndex("organizations", ["subscription_status"], {
      name: "organizations_subscription_status_idx",
    });

    await queryInterface.addIndex("organizations", ["industry"], {
      name: "organizations_industry_idx",
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("organizations");
  },
};
