import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("user_profiles", {
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
      headline: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      current_location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      preferred_locations: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      current_company: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      current_position: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      total_experience_years: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      skills: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      education: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      work_experience: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      certifications: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      languages: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      resume_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      resume_uploaded_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      portfolio_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      linkedin_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      github_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      expected_salary_min: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      expected_salary_max: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      salary_currency: {
        type: DataTypes.STRING(3),
        defaultValue: "USD",
        allowNull: false,
      },
      notice_period_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      availability_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      job_preferences: {
        type: DataTypes.JSONB,
        defaultValue: {},
        allowNull: false,
      },
      is_open_to_opportunities: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      is_profile_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      profile_completeness: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      total_applications: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      total_referrals_received: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
    await queryInterface.addIndex("user_profiles", ["user_id"], {
      unique: true,
      name: "user_profiles_user_id_unique",
    });

    await queryInterface.addIndex(
      "user_profiles",
      ["is_open_to_opportunities"],
      {
        name: "user_profiles_open_to_opportunities_idx",
      },
    );

    await queryInterface.addIndex("user_profiles", ["is_profile_public"], {
      name: "user_profiles_is_public_idx",
    });

    await queryInterface.addIndex("user_profiles", ["current_location"], {
      name: "user_profiles_current_location_idx",
    });

    await queryInterface.addIndex("user_profiles", ["total_experience_years"], {
      name: "user_profiles_experience_idx",
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("user_profiles");
  },
};
