# ReferralNetworkHub — Complete Project Overview for Pitch Deck

> **Purpose**: This document is a comprehensive reference to feed into NotebookLM for generating a pitch deck for ReferralNetworkHub.

---

## 🎯 The Problem — Two Broken Systems That Should Be One

### Problem 1: The Job Referral Process Is Broken
1. **Fragmented & Informal**: Job referrals happen through LinkedIn DMs, WhatsApp groups, email chains — with no structure, tracking, or accountability.
2. **Information Asymmetry**: Job seekers don't know *who* can refer them. Employees don't know *who* needs referrals. Recruiters can't distinguish referred vs. direct applicants.
3. **No Tracking or Transparency**: Once a referral is given, neither the referrer nor the candidate knows the status. Referrers don't get credit or incentives.
4. **Companies Lose Money**: Referred candidates are hired 55% faster, cost 50% less, and stay 25% longer — yet most companies have no structured digital referral platform.

### Problem 2: HR Management & Recruitment Are Disconnected
5. **Siloed Systems**: Companies use separate tools for HR management (employee onboarding, departments, org charts) and recruitment (job postings, application tracking, referrals) — creating data silos and redundant workflows.
6. **Employees Are Passive**: Traditional HR systems treat employees as managed assets. They don't empower employees as **active participants in recruitment** through structured referral programs.
7. **No Recruiter Oversight**: Organization leaders can't easily monitor multiple recruiters' performance, compare hiring metrics, or see a unified view of all recruitment activity.
8. **Cross-Org Blindness**: When an employee at Company A wants to move to Company B, there's no system to manage the offboarding→onboarding transition, let alone track cross-organization referrals.

---

## 💡 The Solution — ReferralNetworkHub

**ReferralNetworkHub** is an **open-source, multi-tenant platform** that **combines a full HR Management System (HRMS) with an Employee Referral Network** — the first platform to unify these two domains.

Traditional platforms are either **HR Systems** (manage employees) OR **Referral Platforms** (collect referrals). **ReferralNetworkHub combines both** — making employees active participants in recruitment while managing them as HR assets.

### One-Liner
> *"The all-in-one HR + Referral platform — where companies manage employees, employees drive recruitment, and job seekers land roles through trusted connections."*

### Elevator Pitch
> ReferralNetworkHub is an integrated HR Management and Employee Referral platform where organizations manage their entire employee lifecycle (onboarding, departments, org charts, offboarding), while simultaneously empowering those employees to actively refer candidates. Recruiters get a unified dashboard showing direct AND referred applications, job seekers connect with verified company insiders, and platform admins oversee multiple organizations in a multi-tenant SaaS architecture.

### What Makes This Unique?
This is NOT just a job board or referral tracker. It's a **complete organizational management platform** with:
- 🏢 **Full HRMS**: Employee lifecycle, departments, org charts, reporting structure, performance tracking
- 🤝 **Employee Referral Network**: Structured referral creation, tracking, bonus management
- 📊 **Unified Recruiter Dashboard**: Direct + referred applications in one view with hiring pipeline
- 👥 **Multi-Recruiter Management**: Org admins oversee multiple recruiters with performance KPIs
- 🔄 **Cross-Organization Dynamics**: Employees can refer AND apply across organizations
- 📈 **Complete Hiring Pipeline**: From application to screening to interview rounds to offer to onboarding

---

## 👥 Who Is It For?

ReferralNetworkHub serves **4 core user types** across **7 role hierarchies**:

### 1. Job Seekers (External Candidates)
- Browse and apply for jobs across multiple companies
- Request referrals from verified employees at target companies
- Track application status through the hiring pipeline (Screening → Interview Rounds → Offer → Hired)
- Chat with referral providers to discuss opportunities

### 2. Referral Providers / Employee Referrers
- Generate single-use, email-specific referral links for candidates
- Refer candidates to jobs at their current company
- Track referral applications, progress, and success rates via a dashboard
- Earn points and rewards for sharing jobs, generating referrals, and successful hires
- Add personalized notes to referral links
- Profile shows referral track record (e.g., "12 successful referrals at Google")

### 3. Recruiters (Organizational Hiring Teams)
- Create and manage company profiles using verified company email
- Post job listings visible to all users (including logged-out visitors)
- **Unified Application Dashboard**: See both direct applications AND referred applications in one view
- Receive notifications when users apply or when employees submit referrals
- View analytics: job views, shares, clicks, application source metrics
- Manage full hiring pipeline: Screening → Interview R1/R2/R3 → Offer → Hired

### 4. Organization Admins (HR Management Role)
This is a **critical differentiator** — Org Admins are essentially **HR leaders** with full company management capabilities:
- **Employee Lifecycle Management**: Onboarding workflows, offboarding processes, employee directory
- **Organizational Structure**: Create departments, manage teams, set up reporting hierarchy, view org chart
- **Recruiter Oversight**: Add/remove recruiters, monitor recruiter performance & KPIs, assign jobs to specific recruiters
- **Recruitment Oversight**: View all applications and referrals across all recruiters in the organization
- **Performance Tracking**: Track employee performance, attendance, and referral participation
- **Job Management**: Approve job postings, close positions, assign to recruiters

### 5. Platform Admins (SaaS Management)
- **Platform Super Admin**: Full system control, infrastructure, manages platform admins, system configuration
- **Platform Admin**: Customer-facing operations, manages organizations, platform analytics, customer support
- Block/ban users globally, monitor platform-wide metrics, track referral success rates across all organizations

---

## 🏗️ Platform Architecture — Multi-Tenant Design

### 7 User Roles Across 3 Levels

```
PLATFORM LEVEL:
├── PLATFORM_SUPER_ADMIN (System owner & infrastructure)
└── PLATFORM_ADMIN (Operations & customer support)

ORGANIZATION LEVEL (Multi-tenant):
├── ORGANIZATION_ADMIN (HR management + recruiter oversight)
├── ORG_RECRUITER (Hiring & application management)
└── EMPLOYEE_REFERRER (Active employees who refer candidates)

PUBLIC LEVEL:
├── JOB_SEEKER (External candidates)
└── REFERRAL_PROVIDER (Non-employee referrers)
```

### Tenant Isolation
- Each organization is a separate tenant in a shared database
- Data isolated by `organization_id`
- Role-based access control (RBAC) enforced at every API endpoint
- JWT tokens include organization context for multi-tenant access

### Cross-Organization Dynamics
- An employee at Company A can refer candidates to Company A jobs
- The same employee can also apply to Company B jobs as a Job Seeker
- If hired at Company B, they get offboarded from Company A and onboarded at Company B
- Now they can refer candidates to Company B — creating a network effect

---

## ✨ Key Product Features

### For Job Seekers
| Feature | Description |
|---------|-------------|
| 🔍 Job Exploration | Browse, search, save, and view recommended jobs |
| 🤝 Referral Requests | Request referrals from employees at the job's company |
| 💬 In-Platform Messaging | Chat with Referral Providers about opportunities |
| 📈 Application Tracking | Monitor status: Screening → Interview → Offer → Hired |
| 🔗 Public Job Sharing | Share jobs via link, QR code, WhatsApp, Telegram |

### For Referral Providers
| Feature | Description |
|---------|-------------|
| 🔗 Referral Links | Generate single-use, email-tied referral links |
| 📊 Referral Dashboard | Track applications, progress, and success metrics |
| 🏆 Points & Rewards | Earn points for referrals, gamified with leaderboards/badges |
| 📝 Custom Notes | Add personalized messages to referral links |
| 📈 Success Profile | Profile shows referral track record per company |

### For Recruiters
| Feature | Description |
|---------|-------------|
| 🏢 Company Profiles | Create/manage verified company profiles |
| 📢 Job Posting | Post jobs from recruiter dashboard |
| 📊 Unified Dashboard | All applications (direct + referred) in one view |
| 📩 Notifications | Alerts for applications and referral submissions |
| 📈 Analytics | Job views, shares, clicks, conversion metrics |

### 🏢 For Organization Admins — Full HR Management System (HRMS)

This is the **Company/HR Management** side of the platform — a complete HRMS:

#### Employee Lifecycle Management
| Feature | Description |
|---------|-------------|
| 👤 Employee Onboarding | Create employee profile, assign department/team, set reporting manager, generate employee ID, grant org access |
| 📋 Active Employment | Update employee details, change department/role, update reporting structure, track performance, manage leave/attendance |
| 🚪 Employee Offboarding | Mark as inactive, revoke system access, track exit date, exit interview notes, transfer responsibilities, archive data |
| 📂 Employee Directory | View all active/past employees with search and filters |

#### Organizational Structure Management
| Feature | Description |
|---------|-------------|
| 🏗️ Department Management | Create/edit/delete departments, assign department heads, set budgets, track department metrics |
| 👥 Team Management | Create teams within departments, assign team leads, add/remove members, set team goals |
| 📊 Org Chart | Visual organizational hierarchy, reporting relationships, spans of control, matrix reporting |
| 🔄 Reporting Structure | Set/update manager-report relationships, view hierarchy tree |

#### Recruiter Oversight & Management
| Feature | Description |
|---------|-------------|
| 👔 Recruiter Management | Add/remove recruiters, assign jobs to specific recruiters, view recruiter workload |
| 📈 Recruiter KPIs | Jobs posted, applications received, interviews scheduled, offers made, hires completed, time-to-hire avg |
| 📊 Source Effectiveness | Direct application conversion rate vs. referral application conversion rate per recruiter |
| 🎯 Pipeline Health | Track applications in each stage, identify stuck candidates, monitor pipeline velocity |

#### HR Analytics & Reporting
| Feature | Description |
|---------|-------------|
| ⏱️ Hiring Metrics | Time-to-hire, cost-per-hire, source effectiveness |
| 🤝 Referral Program Stats | Referral volume, referral-to-hire conversion, bonus payouts vs. recruitment savings |
| 📊 Organization Dashboard | All applications across all recruiters, all referrals, all employees in one view |
| 🔍 Referral Oversight | Full visibility: who referred whom for which job at which company |

### For Platform Admins (SaaS Management)
| Feature | Description |
|---------|-------------|
| 🛠️ Control Panel | Manage all organizations, users, platform configuration |
| 📈 Platform Analytics | Cross-organization metrics, system health, performance monitoring |
| 🚫 User Management | Block/unblock users globally, handle escalations |
| 🏢 Organization Management | Create/update/verify organizations, manage org admins |

### General / Platform-Wide
| Feature | Description |
|---------|-------------|
| 🔒 Secure Auth | JWT + httpOnly cookies + role-based access |
| 🌍 Public Job Sharing | Jobs visible to logged-out users; tracked for logged-in |
| 🔐 Security | Rate limiting, CAPTCHA, referral link expiry |
| 📱 Mobile-Friendly | Fully responsive UI with social sharing options |
| 📧 Email Notifications | Automated alerts at key stages (onboarding, applications, referrals, offers) |
| 🎨 Beautiful UI | Modern, polished interface with dark/light theme |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router (SSR + SSG) |
| **React 19** | UI component library |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** (Radix UI) | 25+ accessible UI component primitives |
| **Framer Motion** | Smooth animations & transitions |
| **React Hook Form + Zod** | Form handling with schema validation |
| **TanStack React Query** | Server state management & caching |
| **Axios** | HTTP client with cookie-based auth |
| **Recharts** | Data visualization for dashboards |
| **Lucide React + React Icons** | Icon libraries |
| **next-themes** | Dark/light mode support |
| **Vitest** | Unit testing framework |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js 22** | JavaScript runtime |
| **Express.js 5** | Web framework for RESTful APIs |
| **TypeScript 5** | Type-safe backend |
| **PostgreSQL 17** | Primary relational database |
| **Sequelize 6** | ORM for database operations |
| **Redis 7** | Session management, caching, rate limiting |
| **JWT** | Authentication (access + refresh tokens) |
| **Bcrypt** | Password hashing |
| **Nodemailer** | Email service integration |
| **Helmet.js** | Security headers |
| **Swagger/OpenAPI** | Interactive API documentation |
| **Jest + Supertest** | Testing framework |

### DevOps & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Docker + Docker Compose** | Containerized deployment (PostgreSQL + Redis + Backend) |
| **GitHub Actions** | CI/CD pipelines (backend-ci + frontend-ci) |
| **Husky** | Git hooks for pre-commit quality checks |
| **ESLint + Prettier** | Code quality & formatting |

---

## 📊 Database Schema — 17 Models

The platform uses **17 Sequelize models** covering the full domain:

1. **users** — Authentication & base user info (7 user types)
2. **user_sessions** — Active session tracking
3. **refresh_tokens** — JWT refresh token management
4. **password_resets** — Password reset flow
5. **email_verifications** — Email verification tokens
6. **invite_tokens** — Invitation system for org admins, recruiters, employees
7. **organizations** — Multi-tenant company entities
8. **organization_admins** — HR admins per organization
9. **recruiters** — Hiring team members
10. **employees** — Active/past company employees
11. **user_profiles** — Detailed candidate profiles
12. **jobs** — Job postings with full details
13. **applications** — Job applications with pipeline stages
14. **referrals** — Employee referral records
15. **departments** — Organization departments
16. **org_chart** — Organizational hierarchy
17. **referral_bonuses** — Reward tracking

---

## 🔐 Security Architecture

| Layer | Implementation |
|-------|---------------|
| **Authentication** | JWT access tokens (1h) + refresh tokens (7d) |
| **Token Storage** | httpOnly, secure, sameSite cookies |
| **Password Security** | bcrypt hashing |
| **Session Management** | Redis-backed, max 5 sessions per user |
| **Rate Limiting** | Global + per-endpoint, Redis-backed |
| **CORS** | Configurable per environment |
| **Headers** | Helmet.js security headers |
| **Input Validation** | express-validator on all endpoints |
| **SQL Injection** | Sequelize parameterized queries |
| **RBAC** | Role + organization-scoped permissions |
| **Email Verification** | Required for non-admin users |
| **Invite System** | Token-based with expiry (48-72h) |
| **Secret Management** | Environment variables, never committed |

---

## 📡 API Surface — 40+ Endpoints (Implemented)

### Authentication (`/api/auth`) — 12 endpoints
- Register, Login, Logout, Logout-all
- Refresh tokens, Validate tokens
- Session management
- Password reset flow
- Email verification flow

### Invitations (`/api/auth/invites`) — 4 endpoints
- Invite org admins, recruiters, employees
- Accept invitations via token

### Organizations (`/api/organizations`) — Company Management
- Create/list/update/delete organizations (tenant entities)
- Add/remove org admins, manage organization verification
- Get organization statistics and analytics

### HR Management (`/api/hr`) — Full HRMS
- Employee onboarding/offboarding workflows
- Department creation and management
- Organization chart and reporting structure
- Employee performance data
- Reporting relationship management

### Employee Management (`/api/employees`)
- List all employees in organization, onboard new employees
- Assign to departments, set reporting managers
- Offboard (soft delete) departing employees

### Recruiter Management (`/api/recruiters`)
- Add/remove/update recruiters for an organization
- View recruiter performance metrics and KPIs
- Assign jobs to specific recruiters

### Jobs (`/api/jobs`)
- Post, search, manage job listings across organizations
- Assign jobs to recruiters, close positions

### Applications (`/api/applications`)
- Apply, track status, manage full hiring pipeline (screening → interview → offer → hired)
- Unified recruiter dashboard (direct + referred apps)

### Referrals (`/api/referrals`)
- Create, track, review referrals, manage bonus payouts
- Cross-organization referral support

### Users & Profiles (`/api/users`, `/api/profile`)
- Profile management (skills, experience, resume, LinkedIn)

### Admin (`/api/admin`)
- Platform-wide user management, blocking, analytics
- Organization dashboard, hiring analytics, recruiter performance analytics

---

## 📈 Development Status

### Backend: ~95% Complete ✅
| Component | Status | Completion |
|-----------|--------|------------|
| Authentication System | ✅ Complete | 100% |
| User Management | ✅ Complete | 100% |
| Session Management (Redis) | ✅ Complete | 100% |
| Invite System | ✅ Complete | 100% |
| Email Services | ✅ Complete | 100% |
| Security (RBAC) | ✅ Complete | 100% |
| API Documentation (Swagger) | ✅ Complete | 100% |
| Database Models (17 models) | ✅ Complete | 100% |
| Organization Module | ✅ Complete | 100% |
| Jobs Module | ✅ Complete | 100% |
| Referrals Module | ✅ Complete | 100% |
| Applications Module | ✅ Complete | 100% |
| HR Management | ✅ Complete | 100% |
| **Total: 93 TypeScript files** |

### Frontend: ~5% Complete (Structure initialized)
| Component | Status |
|-----------|--------|
| Modular Structure | ✅ Complete |
| Home Page (Hero, HowItWorks, WhyChoose) | ✅ Complete |
| UI Components (shadcn/ui initialized) | 🟡 10% |
| Authentication Pages | 🔴 Planned |
| Dashboard Layouts | 🔴 Planned |
| Role-based Routing | 🔴 Planned |

---

## 🎯 Competitive Advantages

1. **HRMS + Referral in One Platform**: The key differentiator — traditional platforms are EITHER HR systems OR referral platforms. ReferralNetworkHub **combines both**, making employees managed HR assets who are also active recruitment participants.
2. **Multi-Tenant SaaS Architecture**: Single platform serves unlimited organizations with tenant-level data isolation — each company gets its own HR system, employee directory, recruiter team, and referral program.
3. **Complete Organizational Management**: Not just job postings — full department management, org charts, reporting hierarchies, employee lifecycle (onboard → manage → offboard).
4. **Unified Recruiter Dashboard**: Recruiters see ALL applications (direct + referred) in one view with full pipeline management — no context switching between tools.
5. **Multi-Recruiter Oversight**: Org Admins can manage multiple recruiters, compare their KPIs, assign jobs, and monitor hiring metrics per recruiter.
6. **Cross-Organization Network**: Employees can refer candidates to their own company AND apply to other companies — creating a powerful network effect. Offboarding at Company A automatically enables onboarding at Company B.
7. **Gamified Referral System**: Points, rewards, leaderboards, and referral bonuses incentivize employees to actively participate in recruitment.
8. **Open-Source & Transparent**: MIT Licensed, community-driven — unlike closed platforms like BambooHR, Greenhouse, or proprietary ATS referral plugins.
9. **Modern Tech Stack**: Next.js 16, React 19, Node.js 22, PostgreSQL 17 — bleeding-edge, production-ready stack.
10. **Enterprise Security**: JWT + Redis sessions + 7-role RBAC + rate limiting + email verification — enterprise-grade from day one.

---

## 💰 Business Model (Potential)

| Revenue Stream | Description |
|---------------|-------------|
| **Freemium SaaS** | Free tier for small orgs, paid plans for enterprise features |
| **Premium Features** | Advanced analytics, AI job matching, priority support |
| **Organization Plans** | Per-seat pricing for recruiter/admin accounts |
| **Featured Listings** | Companies pay to boost job visibility |
| **API Access** | Third-party integrations with existing ATS systems |
| **White-Label** | Organizations can self-host with custom branding |

---

## 📊 Target Market Numbers (Illustrative)

### HR Software Market
- The global **HR management software market** is projected at **$33.57 billion** (2025) → **$56.15 billion** by 2030 (CAGR: 10.8%)
- The **HRM SaaS market** is growing at 11.7% CAGR driven by cloud adoption and remote work

### Recruitment Software Market
- The global **recruitment software market** is projected at **$3.85 billion** (2025) → **$5.6 billion** by 2030
- **82%** of employers rate employee referrals as the best source for ROI
- Referred candidates are **55% faster** to hire
- Referred employees have **25% higher** retention rates
- **46%** of referred hires stay for 3+ years vs. 14% from job boards

### The Combined Opportunity
- ReferralNetworkHub sits at the **intersection of both markets** — a combined **$37B+ opportunity**
- No major player currently integrates full HRMS + structured employee referral programs in a single open-source platform

---

## 🗺️ Roadmap

### Phase 1 — Foundation (✅ Completed)
- Multi-tenant backend architecture
- 7-role RBAC system
- 17 database models
- Complete auth system with Redis sessions
- Organization, Jobs, Referrals, Applications modules
- Swagger API documentation
- CI/CD pipelines
- Docker deployment

### Phase 2 — Frontend Development (🔄 In Progress)
- Authentication pages (Login, Register, Forgot Password)
- Role-based dashboards (Job Seeker, Recruiter, Employee, Admin)
- Job search & application interface
- Referral request & tracking flows
- Real-time messaging system
- Analytics dashboards

### Phase 3 — Growth Features (📋 Planned)
- AI-powered job matching & recommendations
- Advanced analytics & reporting
- Mobile app (React Native)
- OAuth integration (Google, LinkedIn, GitHub)
- Webhook integrations with existing ATS
- Gamification: Leaderboards, badges, streaks
- QR code & social sharing (WhatsApp, Telegram)

### Phase 4 — Enterprise (📋 Planned)
- White-label solutions
- SSO (SAML/OIDC) integration
- Advanced audit logging
- Custom branding per organization
- Dedicated support tiers
- SLA guarantees

---

## 👨‍💻 Creator & Contact

- **Creator**: Rutik Kulkarni
- **Email**: rutikkulkarni2001@gmail.com
- **GitHub**: [github.com/RutikKulkarni/ReferralNetworkHub](https://github.com/RutikKulkarni/ReferralNetworkHub)
- **Discord**: [Community Server](https://discord.gg/UjqwhdD9CG)
- **License**: MIT (Open Source)

---

## 📂 Repository Structure

```
ReferralNetworkHub/
├── frontend/                     # Next.js 16 + React 19 + TypeScript
│   ├── src/
│   │   ├── app/                 # App Router pages
│   │   │   ├── (auth)/          # Login, Signup
│   │   │   └── dashboard/       # Protected dashboards
│   │   ├── components/          # UI: Navbar, Footer, shadcn/ui
│   │   ├── modules/             # Feature modules (auth, home, job, referral, etc.)
│   │   ├── contexts/            # React contexts (AuthContext)
│   │   ├── hooks/               # Custom hooks
│   │   ├── providers/           # QueryClient, Theme providers
│   │   └── types/               # TypeScript type definitions
│   └── package.json
│
├── backend/                      # Node.js 22 + Express 5 + TypeScript
│   ├── src/
│   │   ├── config/              # Database, Redis, Swagger config
│   │   ├── constants/           # App constants (user types, statuses)
│   │   ├── database/            # Migrations & seeders
│   │   ├── modules/             # Feature modules
│   │   │   ├── auth/            # 5 subdirs: controllers, middleware, models, routes, services
│   │   │   ├── admin/           # Platform administration
│   │   │   ├── organization/    # Multi-tenant org management
│   │   │   ├── job/             # Job posting & search
│   │   │   ├── referral/        # Referral lifecycle
│   │   │   ├── application/     # Application pipeline
│   │   │   └── user/            # User profiles
│   │   ├── shared/              # Global middleware, types, utilities
│   │   ├── app.ts               # Express app with all middleware
│   │   └── server.ts            # Entry point
│   ├── MultiTenent_Arch/        # 6 architecture documents
│   ├── docker-compose.yml       # PostgreSQL + Redis + Backend
│   ├── Dockerfile               # Container build
│   └── package.json
│
├── Documentation/                # Project documentation
│   ├── FLOWCHART.md             # 7 Mermaid user flow diagrams
│   ├── CONTRIBUTION_COUNT.md    # Progress tracking
│   └── README.md                # Setup instructions
│
├── .github/workflows/           # CI/CD
│   ├── backend-ci.yml           # Backend lint + test + build
│   └── frontend-ci.yml          # Frontend lint + test + build
│
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE (MIT)
└── README.md                    # Main project overview
```

---

## 🔑 Key Metrics to Highlight in Pitch Deck

- **93 TypeScript backend files** — production-grade codebase
- **17 database models** — comprehensive data architecture
- **40+ API endpoints** — full REST API coverage
- **7 user roles** — enterprise-grade RBAC
- **Multi-tenant architecture** — SaaS-ready from day one
- **Docker-ready** deployment with health checks
- **CI/CD pipelines** for both frontend & backend
- **Swagger API documentation** — developer-friendly
- **MIT Licensed** — open-source with commercial potential
- **Community**: Discord server for contributors

---

## 🎪 Pitch Deck Slide Suggestions

1. **Title Slide**: ReferralNetworkHub — The Integrated HR Management + Employee Referral Platform
2. **Problem (Slide 1)**: HR management and recruitment are siloed — companies use separate disconnected tools
3. **Problem (Slide 2)**: Job referrals are broken — fragmented, untracked, informal, no incentives
4. **Solution**: One platform that combines full HRMS + structured referral network — employees are both managed assets AND active recruiters
5. **The Two Pillars**: Side-by-side — HRMS features (onboarding, departments, org chart) + Referral features (referral links, tracking, bonuses)
6. **How It Works (HR Side)**: Org Admin creates org → Onboards employees → Sets up departments & hierarchy → Manages recruiters
7. **How It Works (Referral Side)**: Employee sees job → Refers candidate → Recruiter reviews in unified dashboard → Candidate hired → Employee earns bonus → Auto-onboarding
8. **For Organizations**: Full HR management — employee lifecycle, departments, org charts, recruiter oversight, hiring analytics
9. **For Recruiters**: Unified dashboard — direct + referred applications, pipeline management, performance KPIs
10. **For Employees**: Dual role — managed by HR + empowered to recruit through referrals + can explore jobs at other orgs
11. **For Job Seekers**: Find jobs, get referred by insiders, track application pipeline
12. **Multi-Tenant Architecture**: Platform → Multiple Organizations → Each with own HR system, recruiters, employees, jobs
13. **Cross-Org Dynamics**: Visual — Employee at Google refers to Google jobs, applies to Microsoft jobs, gets hired, auto-transitions
14. **Technology**: Modern stack diagram (Next.js + Node.js + PostgreSQL + Redis)
15. **Market Opportunity**: $37B+ combined HR software + recruitment software market
16. **Competitive Advantage**: Only platform combining full HRMS + referral network, open-source, multi-tenant SaaS
17. **Traction**: 95% backend complete, 17 models, 93 files, 130+ planned API endpoints, CI/CD live
18. **Business Model**: Freemium SaaS — free for small orgs, paid enterprise plans with advanced HR features
19. **Roadmap**: 4 phases from foundation to enterprise (HRMS + referral + AI matching + white-label)
20. **Team**: Creator profile & open-source community
21. **Ask**: What you're looking for (contributors, funding, partnerships)
