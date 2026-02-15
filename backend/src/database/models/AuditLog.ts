import {
  Model,
  DataTypes,
  Sequelize,
  Optional,
} from "sequelize";

export interface AuditLogAttributes {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string | null;
  changes: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class AuditLog
  extends Model<
    AuditLogAttributes,
    Optional<AuditLogAttributes, "id" | "entityId" | "changes" | "ipAddress" | "userAgent" | "createdAt" | "updatedAt">
  >
  implements AuditLogAttributes
{
  declare id: string;
  declare userId: string;
  declare action: string;
  declare entityType: string;
  declare entityId: string | null;
  declare changes: Record<string, unknown> | null;
  declare ipAddress: string | null;
  declare userAgent: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static initModel(sequelize: Sequelize): typeof AuditLog {
    AuditLog.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "user_id",
        },
        action: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        entityType: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: "entity_type",
        },
        entityId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: "entity_id",
        },
        changes: {
          type: DataTypes.JSONB,
          allowNull: true,
        },
        ipAddress: {
          type: DataTypes.STRING(45),
          allowNull: true,
          field: "ip_address",
        },
        userAgent: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: "user_agent",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          field: "updated_at",
        },
      },
      {
        sequelize,
        tableName: "audit_logs",
        timestamps: true,
        underscored: true,
        indexes: [
          {
            fields: ["user_id"],
          },
          {
            fields: ["action"],
          },
          {
            fields: ["entity_type"],
          },
          {
            fields: ["created_at"],
          },
        ],
      },
    );

    return AuditLog;
  }
}
