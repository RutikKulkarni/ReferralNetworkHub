# Implementation Checklist - Referral Network Hub Multi-Tenant Architecture

## 📋 Overview

This checklist tracks the implementation of the multi-tenant architecture combining HR Management and Employee Referral System.

**Status**: 🔴 NOT STARTED  
**Estimated Time**: 4-6 weeks  
**Last Updated**: 2026-01-26

---

## Phase 1: Database Schema & Models (Week 1-2)

### 1.1 Database Tables Creation

- [ ] Create `organizations` table
  - [ ] Schema definition
  - [ ] Indexes (name, created_at)
  - [ ] Timestamps
- [ ] Create `organization_admins` table
  - [ ] Schema with user_id + organization_id
  - [ ] Unique constraint
  - [ ] Foreign keys with CASCADE
- [ ] Create `recruiters` table
  - [ ] Schema with user_id + organization_id
  - [ ] Unique constraint
  - [ ] Indexes
- [ ] Create `employees` table
  - [ ] Schema with full employee details
  - [ ] Department, manager relationships
  - [ ] Status tracking (active/inactive)
  - [ ] Indexes for org_id, user_id, department
- [ ] Create `user_profiles` table
  - [ ] Skills, experience, education
  - [ ] Resume URL
  - [ ] JSON fields for flexibility
- [ ] Create `jobs` table
  - [ ] Job details with organization_id
  - [ ] Posted by (recruiter_id)
  - [ ] Status enum
  - [ ] Indexes
- [ ] Create `referrals` table
  - [ ] Referrer, candidate, job relationships
  - [ ] Status enum
  - [ ] Bonus tracking fields
  - [ ] Unique constraint (job_id, candidate_id)
- [ ] Create `applications` table
  - [ ] Applicant, job, referral relationships
  - [ ] Status enum (pipeline stages)
  - [ ] Reviewed by tracking
  - [ ] Unique constraint (job_id, applicant_id)

- [ ] Update `users` table
  - [ ] Add user_type enum column
  - [ ] Remove deprecated companyName column
  - [ ] Add migration for existing data

- [ ] Keep existing tables
  - [ ] `refresh_tokens` (already converted)
  - [ ] `password_reset` (already converted)

### 1.2 Sequelize Models

- [ ] Create `Organization.model.ts`
  - [ ] Define model with validations
  - [ ] Add associations
  - [ ] Add scopes (active, verified)
- [ ] Create `OrganizationAdmin.model.ts`
  - [ ] Define model
  - [ ] Add associations (User, Organization)
  - [ ] Add validation methods
- [ ] Create `Recruiter.model.ts`
  - [ ] Define model
  - [ ] Add associations
  - [ ] Add query methods
- [ ] Create `Employee.model.ts`
  - [ ] Define model with all HR fields
  - [ ] Add associations (User, Organization, Manager)
  - [ ] Add scopes (active, byDepartment)
  - [ ] Add instance methods (offboard, changeDepartment)
- [ ] Create `UserProfile.model.ts`
  - [ ] Define model for job seeker profiles
  - [ ] Add associations
  - [ ] Add search methods
- [ ] Create `Job.model.ts`
  - [ ] Define model
  - [ ] Add associations (Organization, Recruiter)
  - [ ] Add scopes (active, byOrg, byRecruiter)
- [ ] Create `Referral.model.ts`
  - [ ] Define model
  - [ ] Add associations (Job, Referrer, Candidate, Organization)
  - [ ] Add instance methods (accept, reject, markHired)
- [ ] Create `Application.model.ts`
  - [ ] Define model
  - [ ] Add associations (Job, Applicant, Referral)
  - [ ] Add pipeline methods (moveStage, reject, hire)

- [ ] Update `User.model.ts`
  - [ ] Change role to user_type
  - [ ] Add new associations
  - [ ] Add helper methods (isEmployee, isRecruiter, etc.)

### 1.3 Model Relationships

- [ ] Define all hasMany/belongsTo relationships
- [ ] Set up CASCADE deletes where appropriate
- [ ] Configure eager loading strategies
- [ ] Add indexes for foreign keys
- [ ] Test all relationships

### 1.4 Migrations

- [ ] Create migration: `01-create-organizations.js`
- [ ] Create migration: `02-create-organization-admins.js`
- [ ] Create migration: `03-create-recruiters.js`
- [ ] Create migration: `04-create-employees.js`
- [ ] Create migration: `05-create-user-profiles.js`
- [ ] Create migration: `06-create-jobs.js`
- [ ] Create migration: `07-create-referrals.js`
- [ ] Create migration: `08-create-applications.js`
- [ ] Create migration: `09-update-users-table.js`
- [ ] Test all migrations (up and down)
- [ ] Create seed data for testing

---

## Phase 2: Authentication & Authorization (Week 2)

### 2.1 JWT Updates

- [ ] Update JWT payload structure
  - [ ] Add organization_id (if applicable)
  - [ ] Add user_type
  - [ ] Add permissions array
- [ ] Update token generation in auth controller
- [ ] Update token verification middleware
- [ ] Test token flow end-to-end

### 2.2 Middleware Creation

- [ ] Create `tenant.middleware.ts`
  - [ ] Extract organization context from request
  - [ ] Validate user has access to organization
  - [ ] Attach req.tenant
  - [ ] Add error handling
- [ ] Update `auth.middleware.ts`
  - [ ] Support new user types
  - [ ] Add organization validation
  - [ ] Improve error messages
- [ ] Create `role.middleware.ts`
  - [ ] requireRole() factory function
  - [ ] requireOrganizationAccess()
  - [ ] requirePermission()
  - [ ] Organization-scoped checks

### 2.3 Permission System

- [ ] Create `permissions.ts` constants file
  - [ ] Define all permissions
  - [ ] Map roles to permissions
- [ ] Create permission checker utility
- [ ] Add permission decorators (optional)
- [ ] Test permission matrix

---

## Phase 3: Controllers & Services (Week 3-4)

### 3.1 Organization Management

- [ ] Create `organization.controller.ts`
  - [ ] POST / (create organization - super admin)
  - [ ] GET / (list all - super admin)
  - [ ] GET /:id (get details)
  - [ ] PATCH /:id (update)
  - [ ] DELETE /:id (soft delete)
  - [ ] POST /:id/admins (add admin)
  - [ ] DELETE /:id/admins/:userId (remove admin)
  - [ ] GET /my-org (get my organization)
  - [ ] GET /my-org/stats (org statistics)
- [ ] Create `organization.service.ts`
  - [ ] Business logic for all operations
  - [ ] Validation methods
  - [ ] Statistics calculations

### 3.2 Employee Management (HR)

- [ ] Create `employee.controller.ts`
  - [ ] GET / (list all in org)
  - [ ] POST / (onboard employee)
  - [ ] GET /:id (get employee details)
  - [ ] PATCH /:id (update employee)
  - [ ] DELETE /:id (offboard - soft delete)
  - [ ] POST /:id/department (assign department)
  - [ ] POST /:id/manager (set manager)
  - [ ] GET /departments (list departments)
  - [ ] POST /departments (create department)
  - [ ] GET /org-chart (organization chart)
- [ ] Create `employee.service.ts`
  - [ ] Onboarding logic
  - [ ] Offboarding logic
  - [ ] Department management
  - [ ] Org chart generation

### 3.3 Recruiter Management

- [ ] Create `recruiter.controller.ts`
  - [ ] GET / (list all in org)
  - [ ] POST / (add recruiter)
  - [ ] GET /:id (get details)
  - [ ] PATCH /:id (update)
  - [ ] DELETE /:id (remove)
  - [ ] GET /:id/stats (performance metrics)
  - [ ] POST /:id/assign-job (assign job)
- [ ] Create `recruiter.service.ts`
  - [ ] Statistics calculation
  - [ ] Performance metrics
  - [ ] Workload balancing

### 3.4 Job Management

- [ ] Create `job.controller.ts`
  - [ ] GET / (public - list all jobs)
  - [ ] GET /:id (public - job details)
  - [ ] POST / (recruiter - create job)
  - [ ] PATCH /:id (recruiter - update)
  - [ ] DELETE /:id (close job)
  - [ ] GET /my-jobs (recruiter's jobs)
  - [ ] GET /organization (org admin - all org jobs)
  - [ ] PATCH /:id/assign-recruiter (org admin)
- [ ] Create `job.service.ts`
  - [ ] Job posting logic
  - [ ] Search/filter logic
  - [ ] Job assignment logic

### 3.5 Application Management

- [ ] Create `application.controller.ts`
  - [ ] POST / (submit application)
  - [ ] GET /my-applications (user's applications)
  - [ ] GET /:id (application details)
  - [ ] PATCH /:id/withdraw (withdraw)
  - [ ] GET / (recruiter - all for org)
  - [ ] GET /job/:jobId (applications for job)
  - [ ] PATCH /:id/status (move in pipeline)
  - [ ] POST /:id/notes (add notes)
  - [ ] GET /dashboard (unified dashboard)
  - [ ] GET /organization (org admin - all)
- [ ] Create `application.service.ts`
  - [ ] Application submission logic
  - [ ] Dashboard data aggregation
  - [ ] Pipeline management
  - [ ] Notification triggers

### 3.6 Referral Management

- [ ] Create `referral.controller.ts`
  - [ ] POST / (create referral)
  - [ ] GET /my-referrals (referrer's referrals)
  - [ ] GET /:id (referral details)
  - [ ] GET /bonuses (bonus tracking)
  - [ ] GET /received (referrals I received)
  - [ ] GET / (recruiter - all for org)
  - [ ] PATCH /:id/review (accept/reject)
  - [ ] PATCH /:id/bonus (update bonus)
  - [ ] GET /organization (org admin - all)
  - [ ] GET /stats (referral program stats)
- [ ] Create `referral.service.ts`
  - [ ] Referral creation logic
  - [ ] Review process
  - [ ] Bonus calculation
  - [ ] Statistics

### 3.7 User Profile

- [ ] Create `profile.controller.ts`
  - [ ] GET /me (my profile)
  - [ ] PATCH /me (update profile)
  - [ ] POST /me/resume (upload resume)
  - [ ] POST /me/skills (add skills)
  - [ ] PATCH /me/experience (update experience)
  - [ ] GET /:id (view other's profile if authorized)
- [ ] Create `profile.service.ts`
  - [ ] Profile management
  - [ ] Resume handling
  - [ ] Privacy controls

### 3.8 Admin Dashboard

- [ ] Create `admin.controller.ts` (update existing)
  - [ ] GET /dashboard (org admin dashboard)
  - [ ] GET /stats (org statistics)
  - [ ] GET /analytics/hiring (hiring analytics)
  - [ ] GET /analytics/referrals (referral analytics)
  - [ ] GET /analytics/recruiters (recruiter performance)
  - [ ] Keep existing: GET /users, PATCH /users/:id/block, etc.
- [ ] Create `admin.service.ts`
  - [ ] Dashboard data aggregation
  - [ ] Analytics calculations
  - [ ] Reporting logic

### 3.9 HR Management

- [ ] Create `hr.controller.ts`
  - [ ] GET /employees (all employees)
  - [ ] POST /employees/onboard (onboard)
  - [ ] POST /employees/:id/offboard (offboard)
  - [ ] GET /departments (departments)
  - [ ] POST /departments (create department)
  - [ ] PATCH /departments/:id (update)
  - [ ] GET /org-chart (org chart)
  - [ ] POST /reporting-structure (update)
  - [ ] GET /performance/:employeeId (performance)
- [ ] Create `hr.service.ts`
  - [ ] HR workflow logic
  - [ ] Reporting structure management
  - [ ] Performance tracking

---

## Phase 4: Routes & API (Week 4)

### 4.1 Route Files

- [ ] Create `organization.routes.ts`
- [ ] Create `employee.routes.ts`
- [ ] Create `recruiter.routes.ts`
- [ ] Create `job.routes.ts`
- [ ] Create `application.routes.ts`
- [ ] Create `referral.routes.ts`
- [ ] Create `profile.routes.ts`
- [ ] Create `hr.routes.ts`
- [ ] Update `admin.routes.ts`
- [ ] Update `auth.routes.ts` (if needed)

### 4.2 Route Guards

- [ ] Apply authentication middleware
- [ ] Apply tenant middleware
- [ ] Apply role-based guards
- [ ] Test all protected routes
- [ ] Test unauthorized access

### 4.3 API Documentation

- [ ] Document all endpoints (Swagger/OpenAPI)
- [ ] Add request/response examples
- [ ] Document error codes
- [ ] Add authentication info

---

## Phase 5: Business Logic & Utils (Week 4-5)

### 5.1 Utility Functions

- [ ] Create `organization.utils.ts`
  - [ ] Organization validation
  - [ ] Subdomain generation
- [ ] Create `employee.utils.ts`
  - [ ] Employee ID generation
  - [ ] Department utils
- [ ] Create `referral.utils.ts`
  - [ ] Bonus calculation
  - [ ] Eligibility checks
- [ ] Create `analytics.utils.ts`
  - [ ] Metrics calculations
  - [ ] Report generation

### 5.2 Email Notifications

- [ ] Update `email.service.ts`
  - [ ] Organization welcome email
  - [ ] Employee onboarding email
  - [ ] Referral notification emails
  - [ ] Application status emails
  - [ ] Bonus notification emails

### 5.3 Validation

- [ ] Create validation schemas (Joi/Zod)
  - [ ] Organization validation
  - [ ] Employee validation
  - [ ] Job validation
  - [ ] Application validation
  - [ ] Referral validation

---

## Phase 6: Testing (Week 5)

### 6.1 Unit Tests

- [ ] Test all models
- [ ] Test all services
- [ ] Test all utilities
- [ ] Test middleware
- [ ] Target: 80%+ coverage

### 6.2 Integration Tests

- [ ] Test authentication flow
- [ ] Test organization CRUD
- [ ] Test employee management
- [ ] Test recruiter workflows
- [ ] Test job posting
- [ ] Test application flow
- [ ] Test referral flow
- [ ] Test cross-org scenarios
- [ ] Test permission matrix

### 6.3 E2E Tests

- [ ] Complete user journey: job seeker
- [ ] Complete user journey: employee
- [ ] Complete user journey: recruiter
- [ ] Complete user journey: org admin
- [ ] Complete user journey: super admin

---

## Phase 7: Database Migration & Deployment (Week 6)

### 7.1 Data Migration

- [ ] Backup existing database
- [ ] Run new migrations
- [ ] Migrate existing users
  - [ ] Map old roles to new user_types
  - [ ] Create default organization if needed
  - [ ] Migrate companyName to organizations
- [ ] Verify data integrity
- [ ] Test rollback procedures

### 7.2 Environment Configuration

- [ ] Update `.env.example`
- [ ] Add new environment variables
- [ ] Update Docker configuration
- [ ] Update docker-compose.yml

### 7.3 Documentation

- [ ] Update README.md
- [ ] Create deployment guide
- [ ] Create user guides
  - [ ] Super Admin guide
  - [ ] Org Admin guide
  - [ ] Recruiter guide
  - [ ] Employee guide
- [ ] Create API documentation
- [ ] Update architecture diagrams

### 7.4 Deployment

- [ ] Test in development
- [ ] Test in staging
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Performance testing

---

## Phase 8: Post-Deployment (Ongoing)

### 8.1 Monitoring

- [ ] Set up application monitoring
- [ ] Set up database monitoring
- [ ] Set up error tracking
- [ ] Set up performance metrics

### 8.2 Optimization

- [ ] Database query optimization
- [ ] Add caching where needed
- [ ] Optimize API responses
- [ ] Load testing

### 8.3 Features (Future)

- [ ] Organization verification system
- [ ] Advanced analytics dashboard
- [ ] Email templates customization
- [ ] Bulk employee import
- [ ] Interview scheduling integration
- [ ] Background check integration
- [ ] Offer letter generation

---

## 📊 Progress Summary

| Phase                           | Status         | Progress   | ETA      |
| ------------------------------- | -------------- | ---------- | -------- |
| Phase 1: Database & Models      | 🔴 Not Started | 0/40 tasks | Week 1-2 |
| Phase 2: Auth & Authorization   | 🔴 Not Started | 0/12 tasks | Week 2   |
| Phase 3: Controllers & Services | 🔴 Not Started | 0/54 tasks | Week 3-4 |
| Phase 4: Routes & API           | 🔴 Not Started | 0/15 tasks | Week 4   |
| Phase 5: Business Logic         | 🔴 Not Started | 0/13 tasks | Week 4-5 |
| Phase 6: Testing                | 🔴 Not Started | 0/14 tasks | Week 5   |
| Phase 7: Migration & Deployment | 🔴 Not Started | 0/14 tasks | Week 6   |
| Phase 8: Post-Deployment        | 🔴 Not Started | 0/10 tasks | Ongoing  |

**Total Tasks**: 172  
**Completed**: 0  
**Progress**: 0%

---

## 🎯 Next Immediate Steps

1. **Get user approval** on architecture design
2. **Start Phase 1**: Create `organizations` table and model
3. **Set up testing framework** early
4. **Create first migration** for organizations table
5. **Document as you go**

---

**Note**: This checklist should be updated regularly as implementation progresses. Each completed task should be marked with `[x]` and timestamps added for tracking.

**Last Updated**: 2026-01-26  
**Status**: Awaiting Approval to Begin Implementation
