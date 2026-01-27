# Multi-Tenant Referral Network Hub Architecture

## 🎯 Platform Vision: Integrated HR Management + Employee Referral System

**Referral Network Hub** is a comprehensive multi-tenant platform that combines:

- 🏢 **Full HR Management System (HRMS)** - Complete employee lifecycle management
- 🤝 **Employee Referral Network** - Internal + cross-organization referrals
- 📊 **Unified Recruiter Dashboard** - All applications in one view
- 👥 **Multi-recruiter Management** - Org admins oversee multiple recruiters
- 🔄 **Cross-organization Dynamics** - Employees can refer AND apply elsewhere
- 📈 **Complete Hiring Pipeline** - From application to hire

### What Makes This Unique?

Traditional platforms are either:

- **HR Systems** (manage employees) OR **Referral Platforms** (just collect referrals)

**We combine both** - Making employees active participants in recruitment while managing them as HR assets.

### Core Functionality

1. **For Job Seekers (External Users)**:
   - Create profile with skills, experience, resume
   - Browse jobs across all organizations
   - Apply directly to jobs
   - Get referred by employees (stronger application)
   - Track application status

2. **For Organization Employees** (Dual Role):
   - **As Employee**: Managed by org HR (profile, performance, departments)
   - **As Referrer**: Refer candidates to own org's jobs
     - Can refer external job seekers
     - Can refer employees from OTHER organizations
     - Track referral bonuses
   - **As Job Seeker**: Apply to OTHER organizations' jobs
   - Example: John works at Google → can refer candidates to Google + apply to Microsoft

3. **For Recruiters** (Organization-specific):
   - **Unified Dashboard** with all applications:
     - Direct applications (user applied without referral)
     - Referred applications (came through employee referral)
     - See referrer details and referral notes
   - **Complete Pipeline Management**:
     - Screening → Interview → Offer → Hired/Rejected
     - Move candidates between stages
     - Schedule interviews
     - Send offers
   - Post and manage job listings
   - Track hiring metrics (time-to-hire, source effectiveness)

4. **For Organization Admins** (HR Management):
   - **Recruiter Management**:
     - Add/remove recruiters
     - View all recruiters and their performance
     - Assign jobs to specific recruiters
     - Monitor hiring metrics per recruiter
   - **Employee Management** (Full HR):
     - Active employees directory
     - Onboarding workflows
     - Offboarding processes
     - Department/team assignments
     - Reporting structure
     - Performance tracking
   - **Organization Structure**:
     - Create departments
     - Manage teams
     - Set up hierarchy
   - **Job Oversight**:
     - Approve job postings
     - Close positions
     - View all applications across recruiters

5. **For Platform Super Admins**:
   - Full system control and configuration
   - Manage platform admins and other super admins
   - System-level operations and security
   - Infrastructure and database access
   - Final escalation and audit access

6. **For Platform Admins**:
   - Manage all organizations (create/update/view)
   - Platform-wide analytics and reporting
   - Monitor system health and performance
   - Handle customer support escalations
   - Block/unblock users globally
   - Cannot access system configuration or infrastructure

## 🎯 Requirements Analysis

### User Hierarchy & Roles

```
1. PLATFORM_SUPER_ADMIN (Highest Platform Level) - MULTIPLE ALLOWED
   ├── Full system control (God Mode)
   ├── Manages entire platform and infrastructure
   ├── Can create/manage PLATFORM_ADMINs
   ├── Can create/manage SUPER_ADMINs (other super admins)
   ├── Can create/manage ORGANIZATION_ADMINs
   ├── System-level configuration access
   ├── Database and infrastructure access
   ├── Security and compliance management
   └── Final escalation point

2. PLATFORM_ADMIN (Platform Level) - MULTIPLE ALLOWED
   ├── Platform-wide operational access
   ├── Can create/manage ORGANIZATION_ADMINs
   ├── Can manage organizations (create/update/view, cannot delete)
   ├── Handle customer support escalations
   ├── Platform-wide analytics and reporting
   ├── Block/unblock users globally
   ├── **CANNOT**:
   │   ├── Manage other platform admins or super admins
   │   ├── Access system configuration
   │   ├── Access infrastructure/database directly
   │   └── Delete organizations
   └── Customer-facing operations role

3. ORGANIZATION_ADMIN (Organization Level) - MULTIPLE PER ORG ALLOWED
   ├── Manages one or more organizations
   ├── Multiple admins can manage the same organization
   ├── **Full HR Management Capabilities**:
   │   ├── Employee onboarding/offboarding
   │   ├── Department and team structure
   │   ├── Organizational hierarchy
   │   └── Performance and attendance tracking
   ├── **Recruiter Management**:
   │   ├── Can create/manage multiple ORG_RECRUITERS
   │   ├── View all recruiters' dashboards
   │   ├── Monitor hiring metrics across recruiters
   │   └── Assign jobs to specific recruiters
   ├── Can manage EMPLOYEES of their organizations
   ├── Can manage/view NON-ORG users interacting with their org (applicants, referral providers)
   ├── Can view applications and referrals for their org jobs
   ├── Can manage job postings for their organizations
   └── Organization-scoped access

4. ORG_RECRUITER (Organization Level)
   ├── MUST be connected to an organization
   ├── Cannot exist without organization
   ├── Cannot self-register (created by ORGANIZATION_ADMIN)
   ├── **Unified Dashboard** showing:
   │   ├── All applications (direct + referred)
   │   ├── Application pipeline (screening → interview → offer → hired)
   │   ├── Referral tracking
   │   ├── Interview schedules
   │   └── Hiring analytics
   ├── Can post jobs for their organization
   ├── Can manage applications and referrals
   ├── Can schedule interviews
   └── Organization-scoped access

4. USERS (3 Types):

   a) JOB_SEEKER (External User)
      ├── Not connected to any organization
      ├── Creates profile (skills, experience, resume)
      ├── Can apply to any organization's jobs
      ├── Can receive referrals from employees
      └── Cannot give referrals

   b) EMPLOYEE_REFERRER (Dual Role - Most Common)
      ├── Connected to ONE organization (as employee)
      ├── **Part of organization's HR system**
      ├── **Can refer others to their own org's jobs**:
      │   ├── External job seekers
      │   └── Employees from other organizations
      ├── **Can apply to OTHER organization jobs**
      ├── Tracks referral bonuses and status
      ├── Can see their referral history
      └── Dual identity: Employee at OrgA + Job Seeker for OrgB

   c) REFERRAL_PROVIDER (Pure Referrer - Optional)
      ├── Not connected to any organization
      ├── Only provides referrals (doesn't apply)
      └── Can refer to any organization

   b) EMPLOYEE_REFERRER
      ├── Connected to ONE organization (as employee)
      ├── Can apply to OTHER organization jobs
      ├── Can give referrals for their own org
      └── Dual role: employee + job seeker

   c) REFERRAL_PROVIDER
      ├── Not connected to any organization
      ├── Only provides referrals (doesn't apply)
      └── Helps others get referrals
```

## 📊 Key Features Summary

### 1. **Recruiter Unified Dashboard**

```
Dashboard Components:
├── Applications Tab
│   ├── Direct Applications (users applied without referral)
│   └── Referred Applications (came through employee referrals)
├── Pipeline Management
│   ├── Screening Queue
│   ├── Interview Scheduled
│   ├── Offer Stage
│   ├── Hired
│   └── Rejected
├── Referrals Tab
│   ├── Pending Referrals (awaiting review)
│   ├── Accepted Referrals (moved to application)
│   └── Bonus Tracking
├── Analytics
│   ├── Time-to-hire metrics
│   ├── Source effectiveness (direct vs referral)
│   └── Conversion rates
└── Job Management
    ├── Active Jobs
    ├── Draft Jobs
    └── Closed Jobs
```

### 2. **Employee Referral System**

- Employee at OrgA can refer:
  - External job seekers (not employed anywhere)
  - Employees from OrgB, OrgC, etc.
- Referral tracks:
  - Who referred whom
  - For which job/organization
  - Current status in pipeline
  - Referral bonus (if hired)
- Employee can simultaneously:
  - Give referrals for their own org
  - Apply as candidate to other orgs

### 3. **HR Management (Org Admin)**

```
HR Capabilities:
├── Employee Management
│   ├── Active employees list
│   ├── Onboarding workflows
│   ├── Offboarding process
│   ├── Department assignment
│   └── Reporting structure
├── Recruiter Oversight
│   ├── View all recruiters
│   ├── Monitor recruiter performance
│   ├── Assign jobs to recruiters
│   └── Hiring metrics per recruiter
├── Organizational Structure
│   ├── Departments
│   ├── Teams
│   └── Hierarchy
└── Job Management
    ├── Approve job postings
    ├── Assign to recruiters
    └── Close positions
```

### 4. **Cross-Organization Dynamics**

```
Example Scenario:
John (Employee at Google) can:
├── Refer candidates to Google jobs (his org)
│   ├── Sarah (unemployed job seeker)
│   └── Mike (employee at Microsoft)
├── Apply to jobs at Microsoft (as candidate)
│   ├── Creates application
│   └── Can receive referral from Microsoft employee
└── Track both activities separately
```

### 5. **HR Management System Features**

#### Employee Lifecycle Management

```
Onboarding:
├── Create employee profile
├── Assign to department/team
├── Set reporting manager
├── Generate employee ID
├── Set access permissions
└── Track onboarding tasks

Active Employment:
├── Update employee details
├── Change department/role
├── Update reporting structure
├── Track performance
├── Manage leave/attendance
└── Update compensation

Offboarding:
├── Mark employee as inactive
├── Revoke system access
├── Track exit date
├── Exit interview notes
├── Transfer responsibilities
└── Archive employee data
```

#### Organizational Structure

```
Department Management:
├── Create/edit/delete departments
├── Assign department head
├── Set department budget
├── Track department metrics
└── View all employees in department

Team Management:
├── Create teams within departments
├── Assign team lead
├── Add/remove team members
├── Set team goals
└── Track team performance

Reporting Hierarchy:
├── Set reporting relationships
├── View org chart
├── Track spans of control
└── Manage matrix reporting
```

#### Recruiter Performance Tracking

```
Per-Recruiter Metrics:
├── Jobs posted
├── Applications received
├── Interviews scheduled
├── Offers made
├── Hires completed
├── Time-to-hire average
├── Source effectiveness
│   ├── Direct applications conversion
│   └── Referral applications conversion
├── Pipeline health
│   ├── Applications in each stage
│   └── Stuck candidates
└── Recruiter workload
```

## 📋 Complete Database Schema

### Core Tables

#### 1. **users** (Authentication & Base User Info)

```sql
users {
  id: INTEGER PRIMARY KEY
  email: STRING UNIQUE NOT NULL
  password: STRING NOT NULL
  user_type: ENUM('platform_super_admin', 'platform_admin', 'org_admin', 'org_recruiter', 'employee_referrer', 'job_seeker', 'referral_provider')
  first_name: STRING NOT NULL
  last_name: STRING NOT NULL
  phone: STRING
  is_active: BOOLEAN DEFAULT true
  is_blocked: BOOLEAN DEFAULT false
  block_reason: TEXT
  blocked_at: TIMESTAMP
  email_verified: BOOLEAN DEFAULT false
  last_login: TIMESTAMP
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

NOTE: Multiple users can have user_type='super_admin'
      Multiple users can have user_type='org_admin' for the same organization
```

#### 2. **organizations** (Tenant/Company)

```sql
organizations {
  id: INTEGER PRIMARY KEY
  name: STRING UNIQUE NOT NULL
  slug: STRING UNIQUE NOT NULL
  industry: STRING
  description: TEXT
  website: STRING
  logo_url: STRING
  headquarters_location: STRING
  employee_count: INTEGER
  is_active: BOOLEAN DEFAULT true
  is_verified: BOOLEAN DEFAULT false
  created_by: INTEGER FOREIGN KEY -> users(id)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

INDEXES:
- idx_org_slug (slug)
- idx_org_active (is_active)
```

#### 3. **organization_admins** (Admin-to-Org Mapping)

```sql
organization_admins {
  id: INTEGER PRIMARY KEY
  user_id: INTEGER FOREIGN KEY -> users(id)
  organization_id: INTEGER FOREIGN KEY -> organizations(id)
  role: ENUM('owner', 'admin')
  permissions: JSONB  // Granular permissions if needed
  created_by: INTEGER FOREIGN KEY -> users(id)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

UNIQUE CONSTRAINT: (user_id, organization_id)
INDEXES:
- idx_org_admin_user (user_id)
- idx_org_admin_org (organization_id)

NOTE: Multiple admins can be assigned to the same organization
      role='owner' - Full control, typically the first admin
      role='admin' - Standard admin permissions
      One user can be admin for multiple organizations
```

#### 4. **recruiters** (Org-Bound Recruiters)

```sql
recruiters {
  id: INTEGER PRIMARY KEY
  user_id: INTEGER FOREIGN KEY -> users(id) UNIQUE
  organization_id: INTEGER FOREIGN KEY -> organizations(id) NOT NULL
  job_title: STRING
  department: STRING
  can_post_jobs: BOOLEAN DEFAULT true
  can_manage_referrals: BOOLEAN DEFAULT true
  hired_date: DATE
  created_by: INTEGER FOREIGN KEY -> users(id)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

INDEXES:
- idx_recruiter_user (user_id)
- idx_recruiter_org (organization_id)
```

#### 5. **employees** (Users Working at Organizations)

```sql
employees {
  id: INTEGER PRIMARY KEY
  user_id: INTEGER FOREIGN KEY -> users(id)
  organization_id: INTEGER FOREIGN KEY -> organizations(id) NOT NULL
  job_title: STRING NOT NULL
  department: STRING
  employee_id: STRING
  joined_date: DATE NOT NULL
  is_currently_employed: BOOLEAN DEFAULT true
  left_date: DATE
  can_provide_referrals: BOOLEAN DEFAULT true
  referral_count: INTEGER DEFAULT 0
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

UNIQUE CONSTRAINT: (user_id, organization_id)
INDEXES:
- idx_employee_user (user_id)
- idx_employee_org (organization_id)
- idx_employee_active (is_currently_employed)
```

#### 6. **user_profiles** (Extended User Info)

```sql
user_profiles {
  id: INTEGER PRIMARY KEY
  user_id: INTEGER FOREIGN KEY -> users(id) UNIQUE
  profile_type: ENUM('job_seeker', 'referral_provider', 'employee')
  bio: TEXT
  skills: JSONB
  experience_years: INTEGER
  current_location: STRING
  preferred_locations: JSONB
  linkedin_url: STRING
  github_url: STRING
  portfolio_url: STRING
  resume_url: STRING
  can_receive_referrals: BOOLEAN DEFAULT true
  can_provide_referrals: BOOLEAN DEFAULT false
  referrals_given: INTEGER DEFAULT 0
  referrals_received: INTEGER DEFAULT 0
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}
```

#### 7. **jobs** (Organization Job Postings)

```sql
jobs {
  id: INTEGER PRIMARY KEY
  organization_id: INTEGER FOREIGN KEY -> organizations(id) NOT NULL
  posted_by: INTEGER FOREIGN KEY -> users(id)
  title: STRING NOT NULL
  description: TEXT NOT NULL
  requirements: JSONB
  location: STRING
  job_type: ENUM('full_time', 'part_time', 'contract', 'internship')
  experience_level: ENUM('entry', 'mid', 'senior', 'lead')
  salary_range_min: DECIMAL
  salary_range_max: DECIMAL
  currency: STRING DEFAULT 'USD'
  skills_required: JSONB
  benefits: JSONB
  is_active: BOOLEAN DEFAULT true
  is_referral_eligible: BOOLEAN DEFAULT true
  referral_bonus: DECIMAL
  application_deadline: DATE
  posted_date: TIMESTAMP DEFAULT NOW()
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

INDEXES:
- idx_job_org (organization_id)
- idx_job_active (is_active)
- idx_job_posted_date (posted_date)
```

#### 8. **referrals**

```sql
referrals {
  id: INTEGER PRIMARY KEY
  job_id: INTEGER FOREIGN KEY -> jobs(id) NOT NULL
  referrer_id: INTEGER FOREIGN KEY -> users(id) NOT NULL
  candidate_id: INTEGER FOREIGN KEY -> users(id) NOT NULL
  organization_id: INTEGER FOREIGN KEY -> organizations(id) NOT NULL
  referral_type: ENUM('internal', 'external')
  status: ENUM('pending', 'accepted', 'rejected', 'hired', 'bonus_paid')
  referral_note: TEXT
  recruiter_reviewed_by: INTEGER FOREIGN KEY -> users(id)  // Org Admin or Recruiter
  reviewed_at: TIMESTAMP
  hired_date: DATE
  bonus_amount: DECIMAL
  bonus_paid_date: DATE
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

UNIQUE CONSTRAINT: (job_id, candidate_id)
INDEXES:
- idx_referral_job (job_id)
- idx_referral_referrer (referrer_id)
- idx_referral_candidate (candidate_id)
- idx_referral_org (organization_id)
- idx_referral_status (status)

NOTE: Org Admins can manage all referrals for their organization,
      including referrals from non-org users (referral providers) for their jobs
```

#### 9. **applications**

```sql
applications {
  id: INTEGER PRIMARY KEY
  job_id: INTEGER FOREIGN KEY -> jobs(id) NOT NULL
  applicant_id: INTEGER FOREIGN KEY -> users(id) NOT NULL
  referral_id: INTEGER FOREIGN KEY -> referrals(id)
  organization_id: INTEGER FOREIGN KEY -> organizations(id) NOT NULL
  application_status: ENUM('submitted', 'screening', 'interview', 'offer', 'hired', 'rejected')
  resume_url: STRING
  cover_letter: TEXT
  applied_date: TIMESTAMP DEFAULT NOW()
  reviewed_by: INTEGER FOREIGN KEY -> users(id)  // Org Admin or Recruiter who reviewed
  last_updated_by: INTEGER FOREIGN KEY -> users(id)
  updated_at: TIMESTAMP
  created_at: TIMESTAMP
}

UNIQUE CONSTRAINT: (job_id, applicant_id)
INDEXES:
- idx_application_job (job_id)
- idx_application_applicant (applicant_id)
- idx_application_org (organization_id)
- idx_application_status (application_status)
- idx_application_reviewed (reviewed_by)

NOTE: Org Admins can view/manage all applications for their org's jobs,
      including those from non-org connected users (job seekers, referral providers)
```

#### 10. **refresh_tokens** (Session Management)

```sql
refresh_tokens {
  id: INTEGER PRIMARY KEY
  token: STRING(500) UNIQUE NOT NULL
  user_id: INTEGER FOREIGN KEY -> users(id) NOT NULL
  device_info: STRING
  ip_address: STRING
  expires_at: TIMESTAMP NOT NULL
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
}

INDEXES:
- idx_token_user (user_id)
- idx_token_expires (expires_at)
```

## 🔐 Role-Based Access Control (RBAC)

### Permission Matrix

| Resource               | PLATFORM_SUPER_ADMIN | PLATFORM_ADMIN | ORG_ADMIN                 | RECRUITER    | EMPLOYEE      | JOB_SEEKER | REFERRAL_PROVIDER |
| ---------------------- | -------------------- | -------------- | ------------------------- | ------------ | ------------- | ---------- | ----------------- |
| System Configuration   | ✅                   | ❌             | ❌                        | ❌           | ❌            | ❌         | ❌                |
| Manage Platform Admins | ✅                   | ❌             | ❌                        | ❌           | ❌            | ❌         | ❌                |
| Infrastructure Access  | ✅                   | ❌             | ❌                        | ❌           | ❌            | ❌         | ❌                |
| Create Organization    | ✅                   | ✅             | ❌                        | ❌           | ❌            | ❌         | ❌                |
| Delete Organization    | ✅                   | ❌             | ❌                        | ❌           | ❌            | ❌         | ❌                |
| Manage Any Org         | ✅                   | ✅             | ❌                        | ❌           | ❌            | ❌         | ❌                |
| Manage Own Org         | ✅                   | ✅             | ✅                        | ❌           | ❌            | ❌         | ❌                |
| Create Super Admin     | ✅                   | ❌             | ❌                        | ❌           | ❌            | ❌         | ❌                |
| Create Platform Admin  | ✅                   | ❌             | ❌                        | ❌           | ❌            | ❌         | ❌                |
| Create Org Admin       | ✅                   | ✅             | ✅ (owner only)           | ❌           | ❌            | ❌         | ❌                |
| Create Recruiter       | ✅                   | ✅             | ✅                        | ❌           | ❌            | ❌         | ❌                |
| Manage Org Employees   | ✅                   | ✅ (any org)   | ✅ (own org)              | ❌           | ❌            | ❌         | ❌                |
| View Org Applicants    | ✅                   | ✅ (any org)   | ✅ (own org)              | ✅ (own org) | ❌            | ❌         | ❌                |
| Block Users Globally   | ✅                   | ✅             | ❌                        | ❌           | ❌            | ❌         | ❌                |
| Manage Non-Org Users\* | ✅                   | ✅             | ✅ (interacting with org) | ❌           | ❌            | ❌         | ❌                |
| Post Jobs              | ✅                   | ❌             | ✅                        | ✅ (own org) | ❌            | ❌         | ❌                |
| View All Jobs          | ✅                   | ✅             | ✅ (own org)              | ✅ (own org) | ✅            | ✅         | ✅                |
| Apply to Jobs          | ✅                   | ✅             | ❌                        | ❌           | ✅ (external) | ✅         | ❌                |
| Give Referrals         | ✅                   | ✅             | ❌                        | ✅ (own org) | ✅ (own org)  | ❌         | ✅                |
| Receive Referrals      | ✅                   | ✅             | ❌                        | ❌           | ✅ (external) | ✅         | ❌                |
| Manage Applications    | ✅                   | ✅ (any org)   | ✅ (own org)              | ✅ (own org) | ❌            | ❌         | ❌                |
| View Referrals         | ✅                   | ✅ (any org)   | ✅ (own org)              | ✅ (own org) | ✅ (own)      | ✅ (own)   | ✅ (own)          |
| Manage Referrals       | ✅                   | ✅ (any org)   | ✅ (own org)              | ✅ (own org) | ❌            | ❌         | ❌                |
| Platform Analytics     | ✅                   | ✅             | ❌                        | ❌           | ❌            | ❌         | ❌                |

**Key Differences Between Platform Admins**:

- **PLATFORM_SUPER_ADMIN**: Full system control, can manage other admins, infrastructure access, system configuration
- **PLATFORM_ADMIN**: Customer-facing operations, can manage organizations and users, cannot access system level

**Note**:

- _Non-Org Users_ = Job seekers and referral providers who apply/interact with the organization's jobs/referrals. Org Admins can view their profiles, applications, and referrals related to their organization.
- Multiple Super Admins can exist with full platform access
- Multiple Org Admins per organization supported
- Owner role in organization has additional privilege to add more admins

## � API Endpoints Overview

### Authentication Routes (`/api/auth`)

```typescript
POST / register; // Create new user (any role)
POST / login; // Login (all users)
POST / refresh - token; // Refresh access token
POST / logout; // Logout
POST / forgot - password; // Request password reset
POST / reset - password; // Reset password with token
```

### Organization Management (`/api/organizations`)

```typescript
// Super Admin only
POST   /                           // Create new organization
GET    /                           // List all organizations
GET    /:id                        // Get organization details
PATCH  /:id                        // Update organization
DELETE /:id                        // Delete organization (soft delete)
POST   /:id/admins                 // Add org admin
DELETE /:id/admins/:userId         // Remove org admin

// Org Admin (own org)
GET    /my-org                     // Get my organization details
PATCH  /my-org                     // Update my organization
GET    /my-org/stats               // Organization statistics
```

### Employee Management (`/api/employees`)

```typescript
// Org Admin only
GET    /                           // List all employees in org
POST   /                           // Add new employee (onboarding)
GET    /:id                        // Get employee details
PATCH  /:id                        // Update employee
DELETE /:id                        // Offboard employee (soft delete)
POST   /:id/department             // Assign to department
POST   /:id/manager                // Set reporting manager
GET    /departments                // List all departments
POST   /departments                // Create department
PATCH  /departments/:id            // Update department
GET    /org-chart                  // Get organization chart
```

### Recruiter Management (`/api/recruiters`)

```typescript
// Org Admin only
GET    /                           // List all recruiters in org
POST   /                           // Add recruiter
GET    /:id                        // Get recruiter details
PATCH  /:id                        // Update recruiter
DELETE /:id                        // Remove recruiter
GET    /:id/stats                  // Recruiter performance metrics
POST   /:id/assign-job             // Assign job to recruiter
```

### Job Management (`/api/jobs`)

```typescript
// Public
GET    /                           // List all jobs (with filters)
GET    /:id                        // Get job details

// Recruiter (own org jobs)
POST   /                           // Post new job
PATCH  /:id                        // Update job
DELETE /:id                        // Close/delete job
GET    /my-jobs                    // Get my posted jobs

// Org Admin (all org jobs)
GET    /organization               // All jobs in organization
PATCH  /:id/assign-recruiter       // Assign job to recruiter
PATCH  /:id/close                  // Close job posting
```

### Application Management (`/api/applications`)

```typescript
// Job Seeker / Employee applying
POST   /                           // Submit application
GET    /my-applications            // Get my applications
GET    /:id                        // Get application details
PATCH  /:id/withdraw               // Withdraw application

// Recruiter (own org)
GET    /                           // List all applications for org jobs
GET    /job/:jobId                 // Applications for specific job
PATCH  /:id/status                 // Update application status
POST   /:id/notes                  // Add recruiter notes
GET    /dashboard                  // Unified dashboard data
                                   // Returns: {directApps, referredApps, pipeline}

// Org Admin (all org applications)
GET    /organization               // All applications in org
GET    /recruiter/:recruiterId     // Applications by recruiter
```

### Referral Management (`/api/referrals`)

```typescript
// Employee (referrer)
POST   /                           // Create referral
GET    /my-referrals               // Get referrals I made
GET    /:id                        // Get referral details
GET    /bonuses                    // Track referral bonuses

// Candidate (referred person)
GET    /received                   // Referrals I received

// Recruiter (own org)
GET    /                           // List all referrals for org jobs
PATCH  /:id/review                 // Review referral (accept/reject)
PATCH  /:id/bonus                  // Update bonus status

// Org Admin (all org referrals)
GET    /organization               // All referrals in org
GET    /stats                      // Referral program statistics
```

### User Profile (`/api/profile`)

```typescript
// Own profile
GET    /me                         // Get my profile
PATCH  /me                         // Update my profile
POST   /me/resume                  // Upload resume
POST   /me/skills                  // Add skills
PATCH  /me/experience              // Update experience

// View others (based on role)
GET    /:id                        // Get user profile (if authorized)
```

### Admin Dashboard (`/api/admin`)

```typescript
// Super Admin only
GET    /users                      // List all users
GET    /organizations              // List all organizations
GET    /stats/platform             // Platform-wide stats
PATCH  /users/:id/block            // Block user
PATCH  /users/:id/unblock          // Unblock user

// Org Admin
GET    /dashboard                  // Organization dashboard
GET    /stats                      // Organization statistics
GET    /analytics/hiring           // Hiring analytics
GET    /analytics/referrals        // Referral analytics
GET    /analytics/recruiters       // Recruiter performance
```

### HR Management (`/api/hr`)

```typescript
// Org Admin only
GET    /employees                  // All employees
POST   /employees/onboard          // Onboard new employee
POST   /employees/:id/offboard     // Offboard employee
GET    /departments                // List departments
POST   /departments                // Create department
PATCH  /departments/:id            // Update department
GET    /org-chart                  // Organization chart
POST   /reporting-structure        // Update reporting relationships
GET    /performance/:employeeId    // Employee performance data
```

## �🏗️ Multi-Tenant Implementation Strategy

### 1. Tenant Isolation Model: **Shared Database with Tenant Column**

- Single database, all tables include `organization_id`
- Row-level security via Sequelize scopes
- Middleware enforces tenant context

### 2. Request Flow with Tenant Context

```typescript
Request → AuthMiddleware → TenantMiddleware → Controller → Service → Model
          ↓                  ↓
          Extract User       Extract/Validate Org Context
          Set req.user       Set req.tenant
```

### 3. Middleware Architecture

```typescript
// 1. Authentication Middleware
- Verify JWT token
- Load user from database
- Attach user to req.user

// 2. Tenant Context Middleware
- Extract organization context from:
  * Request headers (X-Organization-Id)
  * User's primary organization
  * Route parameters
- Validate user has access to organization
- Attach organization to req.tenant

// 3. Role Authorization Middleware
- Check user's role and permissions
- Validate organization-scoped access
```

## � Complete Workflow Examples

### Workflow 1: Employee Refers Candidate to Own Organization

```
1. Employee (John) at Google sees job posting
2. John refers his friend Sarah (external job seeker)
   POST /api/referrals
   {
     job_id: 123,
     candidate_id: 456, // Sarah's user ID
     referral_note: "Excellent developer with 5 years experience"
   }
3. System creates referral record (status: pending)
4. Recruiter at Google sees referral in dashboard
   GET /api/applications/dashboard
   Response includes:
   {
     referredApps: [
       {
         application: {...},
         referral: { referrer: "John Doe", note: "Excellent developer..." }
       }
     ]
   }
5. Recruiter reviews and accepts referral
   PATCH /api/referrals/:id/review { status: "accepted" }
6. Sarah applies to the job (now marked as referred)
   POST /api/applications
7. Sarah moves through pipeline: screening → interview → hired
8. John receives referral bonus
   GET /api/referrals/bonuses shows bonus paid
```

### Workflow 2: Cross-Organization Employee Referral

```
1. Mike (Employee at Microsoft) wants to refer Emma (Employee at Apple)
   to a Microsoft job
2. Mike creates referral
   POST /api/referrals
   {
     job_id: 789, // Microsoft job
     candidate_id: 321, // Emma (Apple employee)
     referral_type: "external"
   }
3. Emma receives notification and can apply
4. Emma applies to Microsoft while still employed at Apple
   POST /api/applications { job_id: 789 }
5. Microsoft recruiter sees:
   - Emma's application
   - Referred by Mike (internal employee)
   - Emma currently works at Apple
6. If Emma gets hired:
   - Apple marks her as offboarded
   - Microsoft adds her as new employee
   - Mike gets referral bonus
```

### Workflow 3: Org Admin Manages Recruiters

```
1. Org Admin logs in to HR dashboard
   GET /api/admin/dashboard
2. Views all recruiters
   GET /api/recruiters
   Response: [
     { id: 1, name: "Jane", stats: { activeJobs: 5, applications: 23 } },
     { id: 2, name: "Bob", stats: { activeJobs: 3, applications: 15 } }
   ]
3. Creates new job and assigns to Jane
   POST /api/jobs { title: "Senior Developer", recruiter_id: 1 }
4. Monitors Jane's performance
   GET /api/recruiters/1/stats
   Response: {
     timeToHire: { average: 21 days },
     sourceEffectiveness: {
       direct: { applications: 50, hired: 5, rate: 10% },
       referred: { applications: 23, hired: 8, rate: 34.7% }
     },
     pipeline: {
       screening: 12,
       interview: 8,
       offer: 2
     }
   }
5. Reassigns stuck job to another recruiter
   PATCH /api/jobs/123/assign-recruiter { recruiter_id: 2 }
```

### Workflow 4: Unified Recruiter Dashboard

```
1. Recruiter Jane logs in
   GET /api/applications/dashboard

2. Dashboard shows unified view:
   {
     directApplications: [
       {
         id: 101,
         candidate: "Alice Brown",
         job: "Senior Developer",
         status: "screening",
         source: "direct",
         applied: "2024-01-20"
       }
     ],
     referredApplications: [
       {
         id: 102,
         candidate: "Bob Smith",
         job: "Senior Developer",
         status: "interview",
         source: "referral",
         referredBy: "John Doe (Employee)",
         referralNote: "Worked together at previous company",
         applied: "2024-01-18"
       }
     ],
     pipeline: {
       screening: { count: 12, applications: [...] },
       interview: { count: 5, applications: [...] },
       offer: { count: 2, applications: [...] }
     },
     analytics: {
       thisWeek: { applications: 15, interviews: 8, offers: 2 },
       referralRate: 35%, // 35% of applications came through referrals
       avgTimeToHire: 18 days
     }
   }

3. Jane moves candidate through pipeline:
   PATCH /api/applications/102/status { status: "offer" }

4. Candidate accepts offer:
   PATCH /api/applications/102/status { status: "hired" }

5. System automatically:
   - Creates employee record
   - Triggers onboarding workflow
   - Marks referral for bonus payment
   - Updates recruiter stats
```

### Workflow 5: HR Management - Employee Onboarding

```
1. Org Admin receives new hire (from recruitment)
2. Onboarding process:
   POST /api/hr/employees/onboard
   {
     user_id: 789,
     department_id: 5,
     reporting_manager_id: 12,
     start_date: "2024-02-01",
     job_title: "Senior Developer",
     employee_id: "EMP-2024-123"
   }

3. System creates employee record and:
   - Updates user role to include EMPLOYEE_REFERRER
   - Assigns to department
   - Sets up reporting structure
   - Grants organization access
   - Enables referral capabilities

4. Org Admin views org chart:
   GET /api/hr/org-chart
   Response shows hierarchical structure with new employee

5. New employee can now:
   - Access organization dashboard
   - View organization jobs
   - Create referrals
   - Apply to other organizations
```

### Workflow 6: Cross-Org Application While Employed

```
1. Sarah (Employee at Google) wants to explore opportunities
2. Sarah browses jobs across all organizations
   GET /api/jobs?exclude_my_org=true
3. Sarah finds interesting job at Meta
4. Sarah applies as external candidate
   POST /api/applications
   {
     job_id: 456, // Meta job
     resume_url: "...",
     cover_letter: "..."
   }
5. Meta recruiter sees application:
   - Candidate: Sarah
   - Currently employed at: Google
   - Applied directly (no referral yet)
6. Meta employee Tom knows Sarah and adds referral:
   POST /api/referrals
   {
     job_id: 456,
     candidate_id: Sarah's ID,
     referral_note: "Excellent engineer"
   }
7. Application now shows as "referred" in recruiter dashboard
8. If Sarah gets hired:
   - Google marks Sarah as offboarded
   - Meta creates employee record
   - Tom gets referral bonus
   - Sarah maintains single user account with new org context
```

## �🔄 Migration Plan

### Phase 1: Database Schema Migration

1. Create new tables: organizations, organization_admins, recruiters, employees
2. Migrate existing companyName → organizations
3. Update user table with user_type
4. Create relationships

### Phase 2: Authentication & Authorization

1. Update JWT payload with organization context
2. Implement tenant middleware
3. Create role-based permission system
4. Update all routes with proper guards

### Phase 3: Business Logic Updates

1. Update user registration flow
2. Implement organization onboarding
3. Update recruiter creation (admin-only)
4. Implement employee-referrer logic

### Phase 4: API Refactoring

1. Add organization context to all endpoints
2. Update controllers for tenant isolation
3. Implement organization-scoped queries
4. Add proper access control checks

## 🚀 Implementation Priority

### Critical (Must Have):

1. ✅ Organization model and relationships
2. ✅ User type system (platform_super_admin, platform_admin, org_admin, org_recruiter, employee_referrer, job_seeker, referral_provider)
3. ✅ Tenant context middleware
4. ✅ Recruiter-organization binding
5. ✅ Employee model and referral logic

### High Priority:

6. ✅ Jobs model with organization
7. ✅ Referrals system
8. ✅ Applications tracking
9. ✅ Role-based access control
10. ✅ Organization admin management

### Medium Priority:

11. Organization verification
12. Advanced permissions
13. Analytics per organization
14. Referral bonus tracking

## 📝 Next Steps

1. Review and approve this architecture
2. Create database migration files
3. Implement new models with Sequelize
4. Update authentication system
5. Create tenant middleware
6. Refactor existing controllers
7. Add comprehensive tests
8. Update API documentation

---

## 📝 Architecture Summary

### What This Platform Offers

**For Organizations:**

- ✅ Complete HR Management System (employee lifecycle, org structure, performance tracking)
- ✅ Multi-recruiter hiring team management
- ✅ Unified view of all recruitment activities
- ✅ Built-in employee referral program
- ✅ Analytics and hiring metrics
- ✅ ROI tracking on referral bonuses

**For Recruiters:**

- ✅ Unified dashboard (direct + referred applications in one view)
- ✅ Complete hiring pipeline management
- ✅ Source attribution (see what's working: direct vs referrals)
- ✅ Interview scheduling and offer management
- ✅ Performance tracking and metrics

**For Employees:**

- ✅ Managed as HR assets (profile, department, manager, performance)
- ✅ Active participants in recruitment (refer candidates)
- ✅ Referral bonus tracking
- ✅ Can explore opportunities at other organizations
- ✅ Single account across multiple organizations

**For Job Seekers:**

- ✅ Access to jobs across multiple organizations
- ✅ Direct application capability
- ✅ Benefit from employee referrals (stronger applications)
- ✅ Real-time application tracking
- ✅ Professional profile management

### Key Technical Features

1. **Multi-Tenant Architecture**: Shared database with organization-level isolation
2. **Role-Based Access Control**: 7 user types with granular permissions
3. **Cross-Organization Support**: Users can interact with multiple organizations
4. **Unified Dashboard**: Recruiters see all applications regardless of source
5. **HR Integration**: Recruitment tied directly to HR employee management
6. **Scalable Design**: Support unlimited organizations, recruiters, employees
7. **Audit Trail**: Complete tracking of all actions and status changes

### Database Highlights

- **10+ Tables**: organizations, users, employees, recruiters, jobs, applications, referrals, etc.
- **Proper Relationships**: Foreign keys, unique constraints, indexes for performance
- **Referential Integrity**: CASCADE deletes, proper data consistency
- **Tenant Isolation**: organization_id on all tenant-scoped tables

### Success Metrics This Platform Enables

**For Organizations:**

- Time-to-hire reduction through referrals
- Cost-per-hire reduction (referrals vs job boards)
- Employee engagement (referral participation rate)
- Quality of hire (referred vs direct)

**For Recruiters:**

- Applications per job
- Source effectiveness
- Conversion rates by stage
- Interview-to-hire ratio

**For Referral Program:**

- Referral volume
- Referral-to-hire conversion
- Bonus payout vs recruitment cost savings
- Cross-organization referral success

---

**Status**: 🟢 READY FOR REVIEW  
**Document Version**: 2.0  
**Last Updated**: 2026-01-26  
**Prepared By**: GitHub Copilot  
**Awaiting**: User approval to begin implementation

**Next Step**: Once approved, begin Phase 1 (Database Schema Implementation)
