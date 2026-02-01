import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("referrals", {
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
      referrer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      candidate_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      candidate_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      candidate_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      candidate_resume_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      relationship: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      internal_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "submitted",
        allowNull: false,
      },
      recruiter_reviewed_by: {
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
      review_feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      bonus_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      bonus_currency: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      bonus_status: {
        type: DataTypes.STRING(50),
        defaultValue: "pending",
        allowNull: false,
      },
      bonus_paid_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      bonus_payment_reference: {
        type: DataTypes.STRING(255),
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
    await queryInterface.addIndex("referrals", ["job_id"], {
      name: "referrals_job_id_idx",
    });

    await queryInterface.addIndex("referrals", ["organization_id"], {
      name: "referrals_organization_id_idx",
    });

    await queryInterface.addIndex("referrals", ["referrer_id"], {
      name: "referrals_referrer_id_idx",
    });

    await queryInterface.addIndex("referrals", ["candidate_id"], {
      name: "referrals_candidate_id_idx",
    });

    await queryInterface.addIndex("referrals", ["candidate_email"], {
      name: "referrals_candidate_email_idx",
    });

    await queryInterface.addIndex("referrals", ["status"], {
      name: "referrals_status_idx",
    });

    await queryInterface.addIndex("referrals", ["bonus_status"], {
      name: "referrals_bonus_status_idx",
    });

    await queryInterface.addIndex("referrals", ["recruiter_reviewed_by"], {
      name: "referrals_reviewed_by_idx",
    });

    await queryInterface.addIndex("referrals", ["created_at"], {
      name: "referrals_created_at_idx",
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("referrals");
  },
};
