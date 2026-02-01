import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("applications", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "jobs",
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
      applicant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      referral_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "referrals",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      resume_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      cover_letter: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      portfolio_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      expected_salary: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      salary_currency: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      notice_period_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      availability_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      source: {
        type: DataTypes.STRING(50),
        defaultValue: "direct",
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "submitted",
        allowNull: false,
      },
      stage: {
        type: DataTypes.STRING(50),
        defaultValue: "applied",
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reviewed_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      reviewed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      review_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rejected_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      offer_extended_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      offer_accepted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      hired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      interview_schedule: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      feedback: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      attachments: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      questionnaire_responses: {
        type: DataTypes.JSONB,
        defaultValue: {},
        allowNull: false,
      },
      last_updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
    await queryInterface.addIndex("applications", ["job_id"], {
      name: "applications_job_id_idx",
    });

    await queryInterface.addIndex("applications", ["organization_id"], {
      name: "applications_organization_id_idx",
    });

    await queryInterface.addIndex("applications", ["applicant_id"], {
      name: "applications_applicant_id_idx",
    });

    await queryInterface.addIndex("applications", ["referral_id"], {
      name: "applications_referral_id_idx",
    });

    await queryInterface.addIndex("applications", ["applicant_id", "job_id"], {
      unique: true,
      name: "applications_applicant_job_unique",
    });

    await queryInterface.addIndex("applications", ["status"], {
      name: "applications_status_idx",
    });

    await queryInterface.addIndex("applications", ["stage"], {
      name: "applications_stage_idx",
    });

    await queryInterface.addIndex("applications", ["source"], {
      name: "applications_source_idx",
    });

    await queryInterface.addIndex("applications", ["reviewed_by"], {
      name: "applications_reviewed_by_idx",
    });

    await queryInterface.addIndex("applications", ["created_at"], {
      name: "applications_created_at_idx",
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("applications");
  },
};
