# Referral Network Hub - Quick Reference

## 🎯 What Is This Platform?

**HR Management + Employee Referral System** in one multi-tenant platform.

## 👥 User Hierarchy

```
PLATFORM_SUPER_ADMIN (Platform Owner)
    ↓
PLATFORM_ADMIN (Platform Operations)
ORG_RECRUITER (Hiring Team)
    ↓
EMPLOYEE_REFERRER (Company Employees)

JOB_SEEKER (External Candidates)
REFERRAL_PROVIDER (Non-employee Referrers)
```

## 🏢 Core Concepts

### 1. Platform Administration (2 Levels)

- **Platform Super Admin**: Full system control, infrastructure access, manages platform admins
- **Platform Admin**: Customer-facing operations, manages organizations, no system access

### 2. Organizations

- Each organization is a separate tenant
- Has own employees, recruiters, jobs, applications
- Data isolated by `organization_id`

### 2. Employees (Dual Role)

- **As Employee**: Managed by HR (profile, department, manager)
- **As Referrer**: Can refer candidates to own org's jobs
- **As Job Seeker**: Can apply to OTHER organizations

### 3. Recruiters

- Organization-specific (not platform-wide)
- See unified dashboard: direct + referred applications
- Manage complete hiring pipeline

### 4. Org Admins

- Manage organization HR (employees, departments, structure)
- Oversee multiple recruiters
- View all recruitment activity

## 📊 Key Features

### Unified Recruiter Dashboard

```
┌─────────────────────────────────────┐
│  Direct Applications    |  23       │
│  Referred Applications  |  15       │
├─────────────────────────────────────┤
│  Pipeline Status:                   │
│  - Screening:  12                   │
│  - Interview:   8                   │
│  - Offer:       2                   │
│  - Hired:       1                   │
└─────────────────────────────────────┘
```

### Cross-Organization Referrals

```
Employee A (Google) → Refers → Employee B (Microsoft)
                    ↓
        Google Job Opening
```

### HR Management

- Employee onboarding/offboarding
- Department management
- Org chart & reporting structure
- Performance tracking
- Recruiter oversight

## 🗄️ Database Tables (10+)

1. **organizations** - Tenant entities
2. **users** - Authentication & base info
3. **organization_admins** - HR admins per org
4. **recruiters** - Hiring team members
5. **employees** - Active/past employees
6. **user_profiles** - Detailed candidate profiles
7. **jobs** - Job postings
8. **referrals** - Employee referral records
9. **applications** - Job applications
10. **refresh_tokens** - Session management
11. **password_reset** - Password reset tokens

## 🔐 Permissions Quick Matrix

| Action                 | Platform Super | Platform Admin | Org Admin | Recruiter | Employee | Job Seeker |
| ---------------------- | -------------- | -------------- | --------- | --------- | -------- | ---------- |
| System Configuration   | ✅             | ❌             | ❌        | ❌        | ❌       | ❌         |
| Manage Platform Admins | ✅             | ❌             | ❌        | ❌        | ❌       | ❌         |
| Manage Organizations   | ✅             | ✅             | ❌        | ❌        | ❌       | ❌         |
| Manage Employees       | ✅             | ✅             | ✅        | ❌        | ❌       | ❌         |
| Manage Recruiters      | ✅             | ✅             | ✅        | ❌        | ❌       | ❌         |
| Post Jobs              | ✅             | ❌             | ✅        | ✅        | ❌       | ❌         |
| Review Applications    | ✅             | ✅             | ✅        | ✅        | ❌       | ❌         |
| Create Referrals       | ✅             | ✅             | ✅        | ✅        | ✅       | ✅         |
| Apply to Jobs          | ✅             | ✅             | ✅        | ✅        | ✅       | ✅         |

_Note: ✅ indicates access, with scope restrictions based on role_

## 🌐 Key API Routes

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### Organizations (Super Admin)

```
POST   /api/organizations
GET    /api/organizations
PATCH  /api/organizations/:id
```

### Employees (Org Admin)

```
GET    /api/employees
POST   /api/employees (onboard)
PATCH  /api/employees/:id
DELETE /api/employees/:id (offboard)
```

### Recruiters (Org Admin)

```
GET    /api/recruiters
POST   /api/recruiters
GET    /api/recruiters/:id/stats
```

### Jobs

```
GET    /api/jobs (public)
POST   /api/jobs (recruiter)
PATCH  /api/jobs/:id
```

### Applications

```
POST   /api/applications (apply)
GET    /api/applications/dashboard (recruiter)
PATCH  /api/applications/:id/status
```

### Referrals

```
POST   /api/referrals (create)
GET    /api/referrals/my-referrals
PATCH  /api/referrals/:id/review (recruiter)
```

### HR Management

```
GET    /api/hr/employees
POST   /api/hr/employees/onboard
GET    /api/hr/org-chart
POST   /api/hr/departments
```

## 📈 Success Metrics

### For Organizations:

- ⏱️ Time-to-hire reduction
- 💰 Cost-per-hire savings
- 👥 Employee engagement (referral participation)
- ⭐ Quality of hire (referral vs direct)

### For Recruiters:

- 📊 Applications per job
- 🎯 Source effectiveness (direct vs referral)
- 📈 Conversion rates by pipeline stage
- 🏆 Interview-to-hire ratio

### For Referral Program:

- 🤝 Referral volume
- ✅ Referral-to-hire conversion rate
- 💵 Bonus payout vs recruitment savings
- 🌍 Cross-org referral success

## 🔄 Typical Workflows

### Workflow 1: Employee Refers Candidate

1. Employee creates referral for org job
2. Recruiter sees referral in dashboard
3. Recruiter reviews & accepts referral
4. Candidate applies (marked as referred)
5. Moves through pipeline → hired
6. Employee receives bonus

### Workflow 2: Recruiter Uses Unified Dashboard

1. Recruiter logs in
2. Sees all applications (direct + referred)
3. Filters by source, status, job
4. Moves candidates through pipeline
5. Tracks metrics (time-to-hire, conversion rates)

### Workflow 3: Cross-Org Application

1. Employee at OrgA applies to OrgB job
2. OrgB recruiter sees application
3. OrgB employee refers same candidate (strengthens application)
4. If hired: OrgA offboards, OrgB onboards
5. Single user account, new org context

### Workflow 4: Org Admin Manages HR

1. Views all employees
2. Onboards new hires
3. Assigns to departments
4. Sets reporting structure
5. Monitors recruiter performance
6. Offboards departing employees

## 🏗️ Tech Stack

- **Database**: PostgreSQL 16 + Sequelize ORM
- **Backend**: Node.js + TypeScript + Express
- **Auth**: JWT (access + refresh tokens)
- **Architecture**: Multi-tenant (shared DB, org isolation)
- **Docker**: Container orchestration

## 📝 Implementation Phases

### Phase 1: Database Schema

Create 10+ new tables with relationships

### Phase 2: Authentication

Multi-tenant JWT, role-based permissions

### Phase 3: Models & Services

Sequelize models + business logic

### Phase 4: API Endpoints

130+ endpoints across 8 route groups

### Phase 5: Testing

Unit + integration tests

### Phase 6: Documentation

API docs + deployment guide

---

**For Full Details**: See [MULTI_TENANT_ARCHITECTURE.md](./MULTI_TENANT_ARCHITECTURE.md)

**Status**: 🟢 Ready for Implementation
