import { Sequelize } from "sequelize";
import { User, initUserModel } from "../../modules/auth/models/User";
import { Organization, initOrganizationModel } from "./Organization";
import {
  OrganizationAdmin,
  initOrganizationAdminModel,
} from "./OrganizationAdmin";
import { Recruiter, initRecruiterModel } from "./Recruiter";
import { Employee, initEmployeeModel } from "./Employee";
import { UserProfile, initUserProfileModel } from "./UserProfile";
import { Job, initJobModel } from "./Job";
import { Referral, initReferralModel } from "./Referral";
import { Application, initApplicationModel } from "./Application";
import { AuditLog } from "./AuditLog";

export interface DatabaseModels {
  User: typeof User;
  Organization: typeof Organization;
  OrganizationAdmin: typeof OrganizationAdmin;
  Recruiter: typeof Recruiter;
  Employee: typeof Employee;
  UserProfile: typeof UserProfile;
  Job: typeof Job;
  Referral: typeof Referral;
  Application: typeof Application;
  AuditLog: typeof AuditLog;
}

/**
 * Initialize all models
 */
export const initModels = (sequelize: Sequelize): DatabaseModels => {
  // Initialize models
  const models: DatabaseModels = {
    User: initUserModel(sequelize),
    Organization: initOrganizationModel(sequelize),
    OrganizationAdmin: initOrganizationAdminModel(sequelize),
    Recruiter: initRecruiterModel(sequelize),
    Employee: initEmployeeModel(sequelize),
    UserProfile: initUserProfileModel(sequelize),
    Job: initJobModel(sequelize),
    Referral: initReferralModel(sequelize),
    Application: initApplicationModel(sequelize),
    AuditLog: AuditLog.initModel(sequelize),
  };

  // Set up associations
  setupAssociations(models);

  return models;
};

/**
 * Set up model associations
 */
const setupAssociations = (models: DatabaseModels): void => {
  const {
    User,
    Organization,
    OrganizationAdmin,
    Recruiter,
    Employee,
    UserProfile,
    Job,
    Referral,
    Application,
  } = models;

  // ==================== USER ASSOCIATIONS ====================

  // User -> UserProfile (1:1)
  User.hasOne(UserProfile, {
    foreignKey: "userId",
    as: "profile",
    onDelete: "CASCADE",
  });
  UserProfile.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User -> OrganizationAdmin (1:N)
  User.hasMany(OrganizationAdmin, {
    foreignKey: "userId",
    as: "adminOrganizations",
    onDelete: "CASCADE",
  });
  OrganizationAdmin.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User -> Recruiter (1:1)
  User.hasOne(Recruiter, {
    foreignKey: "userId",
    as: "recruiterProfile",
    onDelete: "CASCADE",
  });
  Recruiter.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User -> Employee (1:N - can be employee at multiple orgs historically)
  User.hasMany(Employee, {
    foreignKey: "userId",
    as: "employments",
    onDelete: "CASCADE",
  });
  Employee.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
  });

  // User -> Applications (1:N)
  User.hasMany(Application, {
    foreignKey: "applicantId",
    as: "applications",
  });
  Application.belongsTo(User, {
    foreignKey: "applicantId",
    as: "applicant",
  });

  // User -> Referrals Given (1:N)
  User.hasMany(Referral, {
    foreignKey: "referrerId",
    as: "referralsGiven",
  });
  Referral.belongsTo(User, {
    foreignKey: "referrerId",
    as: "referrer",
  });

  // User -> Referrals Received (1:N)
  User.hasMany(Referral, {
    foreignKey: "candidateId",
    as: "referralsReceived",
  });
  Referral.belongsTo(User, {
    foreignKey: "candidateId",
    as: "candidate",
  });

  // ==================== ORGANIZATION ASSOCIATIONS ====================

  // Organization -> OrganizationAdmin (1:N)
  Organization.hasMany(OrganizationAdmin, {
    foreignKey: "organizationId",
    as: "admins",
    onDelete: "CASCADE",
  });
  OrganizationAdmin.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
  });

  // Organization -> Recruiter (1:N)
  Organization.hasMany(Recruiter, {
    foreignKey: "organizationId",
    as: "recruiters",
    onDelete: "CASCADE",
  });
  Recruiter.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
  });

  // Organization -> Employee (1:N)
  Organization.hasMany(Employee, {
    foreignKey: "organizationId",
    as: "employees",
    onDelete: "CASCADE",
  });
  Employee.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
  });

  // Organization -> Job (1:N)
  Organization.hasMany(Job, {
    foreignKey: "organizationId",
    as: "jobs",
    onDelete: "CASCADE",
  });
  Job.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
  });

  // Organization -> Referral (1:N)
  Organization.hasMany(Referral, {
    foreignKey: "organizationId",
    as: "referrals",
    onDelete: "CASCADE",
  });
  Referral.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
  });

  // Organization -> Application (1:N)
  Organization.hasMany(Application, {
    foreignKey: "organizationId",
    as: "applications",
    onDelete: "CASCADE",
  });
  Application.belongsTo(Organization, {
    foreignKey: "organizationId",
    as: "organization",
  });

  // ==================== JOB ASSOCIATIONS ====================

  // Job -> User (posted by recruiter)
  Job.belongsTo(User, {
    foreignKey: "postedBy",
    as: "recruiter",
  });
  User.hasMany(Job, {
    foreignKey: "postedBy",
    as: "postedJobs",
  });

  // Job -> Referral (1:N)
  Job.hasMany(Referral, {
    foreignKey: "jobId",
    as: "referrals",
    onDelete: "CASCADE",
  });
  Referral.belongsTo(Job, {
    foreignKey: "jobId",
    as: "job",
  });

  // Job -> Application (1:N)
  Job.hasMany(Application, {
    foreignKey: "jobId",
    as: "applications",
    onDelete: "CASCADE",
  });
  Application.belongsTo(Job, {
    foreignKey: "jobId",
    as: "job",
  });

  // ==================== REFERRAL ASSOCIATIONS ====================

  // Referral -> User (reviewer)
  Referral.belongsTo(User, {
    foreignKey: "recruiterReviewedBy",
    as: "reviewer",
  });
  User.hasMany(Referral, {
    foreignKey: "recruiterReviewedBy",
    as: "reviewedReferrals",
  });

  // ==================== APPLICATION ASSOCIATIONS ====================

  // Application -> Referral (N:1)
  Application.belongsTo(Referral, {
    foreignKey: "referralId",
    as: "referral",
  });
  Referral.hasOne(Application, {
    foreignKey: "referralId",
    as: "application",
  });

  // Application -> User (reviewer)
  Application.belongsTo(User, {
    foreignKey: "reviewedBy",
    as: "reviewer",
  });
  User.hasMany(Application, {
    foreignKey: "reviewedBy",
    as: "reviewedApplications",
  });

  // Application -> User (last updated by)
  Application.belongsTo(User, {
    foreignKey: "lastUpdatedBy",
    as: "lastUpdater",
  });
  User.hasMany(Application, {
    foreignKey: "lastUpdatedBy",
    as: "updatedApplications",
  });

  // ==================== EMPLOYEE ASSOCIATIONS ====================

  // Employee -> Employee (manager self-reference)
  Employee.belongsTo(Employee, {
    foreignKey: "managerId",
    as: "manager",
  });
  Employee.hasMany(Employee, {
    foreignKey: "managerId",
    as: "subordinates",
  });

  // ==================== ORGANIZATION ADMIN ASSOCIATIONS ====================

  // OrganizationAdmin -> User (created by)
  OrganizationAdmin.belongsTo(User, {
    foreignKey: "createdBy",
    as: "creator",
  });
  User.hasMany(OrganizationAdmin, {
    foreignKey: "createdBy",
    as: "createdOrgAdmins",
  });

  // ==================== RECRUITER ASSOCIATIONS ====================

  // Recruiter -> User (created by)
  Recruiter.belongsTo(User, {
    foreignKey: "createdBy",
    as: "creator",
  });
  User.hasMany(Recruiter, {
    foreignKey: "createdBy",
    as: "createdRecruiters",
  });
};

// Export models and types
export {
  User,
  Organization,
  OrganizationAdmin,
  Recruiter,
  Employee,
  UserProfile,
  Job,
  Referral,
  Application,
  AuditLog,
};

// Export attributes types
export type { OrganizationAttributes } from "./Organization";
export type { OrganizationAdminAttributes } from "./OrganizationAdmin";
export type { RecruiterAttributes } from "./Recruiter";
export type { EmployeeAttributes } from "./Employee";
export type { UserProfileAttributes } from "./UserProfile";
export type { JobAttributes } from "./Job";
export type { ReferralAttributes } from "./Referral";
export type { ApplicationAttributes } from "./Application";
export type { AuditLogAttributes } from "./AuditLog";
