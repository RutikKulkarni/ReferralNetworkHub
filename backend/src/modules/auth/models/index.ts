/**
 * Auth Models Index
 * Initializes and exports all auth models with associations
 */

import { Sequelize } from "sequelize";
import { initUserModel, User } from "./User";
import { initUserSessionModel, UserSession } from "./UserSession";
import { initRefreshTokenModel, RefreshToken } from "./RefreshToken";
import { initInviteTokenModel, InviteToken } from "./InviteToken";
import {
  initEmailVerificationModel,
  EmailVerification,
} from "./EmailVerification";
import { initPasswordResetModel, PasswordReset } from "./PasswordReset";

/**
 * Initialize all auth models
 */
export const initAuthModels = (sequelize: Sequelize): void => {
  // Initialize models
  initUserModel(sequelize);
  initUserSessionModel(sequelize);
  initRefreshTokenModel(sequelize);
  initInviteTokenModel(sequelize);
  initEmailVerificationModel(sequelize);
  initPasswordResetModel(sequelize);

  // Define associations

  // User has many sessions
  User.hasMany(UserSession, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "sessions",
  });
  UserSession.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User has many refresh tokens
  User.hasMany(RefreshToken, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "refreshTokens",
  });
  RefreshToken.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User has many email verifications
  User.hasMany(EmailVerification, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "emailVerifications",
  });
  EmailVerification.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User has many password resets
  User.hasMany(PasswordReset, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "passwordResets",
  });
  PasswordReset.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // Invite tokens - inviter
  User.hasMany(InviteToken, {
    sourceKey: "id",
    foreignKey: "invitedBy",
    as: "sentInvites",
  });
  InviteToken.belongsTo(User, {
    foreignKey: "invitedBy",
    as: "inviter",
  });

  // Invite tokens - acceptedBy
  User.hasMany(InviteToken, {
    sourceKey: "id",
    foreignKey: "acceptedBy",
    as: "acceptedInvites",
  });
  InviteToken.belongsTo(User, {
    foreignKey: "acceptedBy",
    as: "acceptedByUser",
  });
};

// Export models
export {
  User,
  UserSession,
  RefreshToken,
  InviteToken,
  EmailVerification,
  PasswordReset,
};
