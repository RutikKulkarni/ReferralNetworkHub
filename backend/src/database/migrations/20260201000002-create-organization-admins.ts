import { QueryInterface, DataTypes } from "sequelize";

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.createTable("organization_admins", {
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
      role: {
        type: DataTypes.STRING(50),
        defaultValue: "admin",
        allowNull: false,
      },
      permissions: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false,
      },
      is_owner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      is_active: {
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
    await queryInterface.addIndex(
      "organization_admins",
      ["user_id", "organization_id"],
      {
        unique: true,
        name: "organization_admins_user_org_unique",
      },
    );

    await queryInterface.addIndex("organization_admins", ["user_id"], {
      name: "organization_admins_user_id_idx",
    });

    await queryInterface.addIndex("organization_admins", ["organization_id"], {
      name: "organization_admins_organization_id_idx",
    });

    await queryInterface.addIndex("organization_admins", ["is_active"], {
      name: "organization_admins_is_active_idx",
    });

    await queryInterface.addIndex("organization_admins", ["is_owner"], {
      name: "organization_admins_is_owner_idx",
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.dropTable("organization_admins");
  },
};
