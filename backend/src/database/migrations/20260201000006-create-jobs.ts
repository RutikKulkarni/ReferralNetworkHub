import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("jobs", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      posted_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      responsibilities: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      benefits: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      employment_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      work_mode: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      experience_min_years: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      experience_max_years: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      salary_min: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      salary_max: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      salary_currency: {
        type: DataTypes.STRING(3),
        defaultValue: "USD",
        allowNull: false,
      },
      is_salary_disclosed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      locations: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      required_skills: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      preferred_skills: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      education_requirements: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      referral_bonus_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      referral_bonus_currency: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      referral_bonus_terms: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_referral_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      max_referrals: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      application_deadline: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "draft",
        allowNull: false,
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      closed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      total_applications: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      total_referrals: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      total_views: {
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
    await queryInterface.addIndex("jobs", ["organization_id"], {
      name: "jobs_organization_id_idx",
    });

    await queryInterface.addIndex("jobs", ["posted_by"], {
      name: "jobs_posted_by_idx",
    });

    await queryInterface.addIndex("jobs", ["slug"], {
      name: "jobs_slug_idx",
    });

    await queryInterface.addIndex("jobs", ["status"], {
      name: "jobs_status_idx",
    });

    await queryInterface.addIndex("jobs", ["employment_type"], {
      name: "jobs_employment_type_idx",
    });

    await queryInterface.addIndex("jobs", ["work_mode"], {
      name: "jobs_work_mode_idx",
    });

    await queryInterface.addIndex("jobs", ["location"], {
      name: "jobs_location_idx",
    });

    await queryInterface.addIndex("jobs", ["is_referral_enabled"], {
      name: "jobs_is_referral_enabled_idx",
    });

    await queryInterface.addIndex("jobs", ["published_at"], {
      name: "jobs_published_at_idx",
    });

    await queryInterface.addIndex("jobs", ["application_deadline"], {
      name: "jobs_application_deadline_idx",
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("jobs");
  },
};
