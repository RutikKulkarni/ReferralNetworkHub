# Documentation

Welcome to the documentation for **ReferralNetworkHub**! This guide provides an overview of the project structure, setup instructions, and usage guidelines for developers and contributors.

## 📂 Project Structure

> Note: The project is under active development. Current focus: Multi-tenant architecture implementation.

**ReferralNetworkHub** is a **multi-tenant platform** combining HR Management with Employee Referral System, built with:

- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js + Express + TypeScript (Monolithic architecture)
- **Database**: PostgreSQL with Sequelize ORM
- **Cache/Sessions**: Redis

### Directory Structure

```
ReferralNetworkHub/
├── frontend/                    # Next.js frontend
│   ├── app/                     # App Router pages
│   │   ├── (auth)/             # Auth pages (login, signup)
│   │   ├── (main)/             # Public pages (home, explore)
│   │   └── (protected)/        # Protected routes
│   ├── components/              # UI components (shadcn/ui)
│   ├── contexts/                # React contexts (AuthContext)
│   ├── lib/                     # Utilities & API clients
│   └── public/                  # Static assets
│
├── backend/                     # Node.js + Express backend
│   ├── src/
│   │   ├── config/             # Database, Redis, Swagger config
│   │   ├── constants/          # Application constants
│   │   ├── database/           # Migrations & seeders
│   │   ├── modules/            # Feature modules
│   │   │   ├── auth/          # Authentication & authorization
│   │   │   ├── platform/      # Platform admin management
│   │   │   ├── organization/  # Organization
│   │   │   ├── jobs/          # Jobs module
│   │   │   └── referrals/     # Referrals module
│   │   ├── shared/            # Middleware, types, utilities
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Server entry point
│   ├── MultiTenent Arch/       # Architecture documentation
│   │   ├── MULTI_TENANT_ARCHITECTURE.md
│   │   ├── IMPLEMENTATION_CHECKLIST.md
│   │   └── QUICK_REFERENCE.md
│   └── SECURITY.md             # Security guidelines
│
├── Documentation/               # Project documentation
│   ├── README.md               # This file
│   ├── CONTRIBUTION_COUNT.md   # Progress tracking
│   └── FLOWCHART.md            # User flow diagrams
│
├── LICENSE                      # ISC License
└── README.md                    # Main project overview
```

## 🛠️ Setup Instructions

To set up **ReferralNetworkHub** locally, follow the detailed instructions in:

- [Frontend README](../frontend/README.md) (Next.js, TypeScript, Tailwind CSS, shadcn/ui)
- [Backend README](../backend/README.md) (Node.js, Express, PostgreSQL, Redis)
- [Backend Development Guide](../backend/DEVELOPMENT.md) (Detailed dev setup)
- [Backend Security Guide](../backend/SECURITY.md) (Security best practices)

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **PostgreSQL**: v14+ (local or cloud)
- **Redis**: v6+ (for sessions and caching)
- **Git**: For version control

### Quick Start

**Backend:**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev  # Runs on http://localhost:5000
```

**Frontend:**

```bash
cd frontend
pnpm install
pnpm dev  # Runs on http://localhost:3000
```

For detailed setup:

- [Backend README](../backend/README.md) - Complete backend setup
- [Frontend README](../frontend/README.md) - Complete frontend setup
- [Architecture Docs](../backend/MultiTenent%20Arch/DOCS_INDEX.md) - System design

## 📘 Multi-Tenant Platform Overview

**ReferralNetworkHub** is a comprehensive platform combining **HR Management System** with **Employee Referral Network**.

### 🎯 Platform Architecture

The platform supports **7 user types** across 3 organizational levels:

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

### 📚 User Capabilities

### For Users

- **Browse & Apply**: View job listings, save jobs, or apply directly. See recommended jobs or track applied jobs.
- **Request Referrals**: Connect with Referral Providers from the job’s company. Your profile is visible to providers only after requesting a referral.
- **Messaging**: Chat with Referral Providers to discuss jobs or share external job IDs/links (requires a complete profile).
- **Track Applications**: Monitor referral progress and interview stages (e.g., “Interviewing - Round 1”).

### For Referral Providers

- **Generate Referral Links**: Create single-use, email-specific referral links for candidates applying to your company’s jobs.
- **Track Referrals**: Monitor applications and progress (e.g., “Referral in Progress”) via a dashboard. Successful referrals (confirmed by the candidate) update your profile (e.g., “1 Successful Referral at Company X”).
- **Earn Points**: Gain points for job sharing, referrals, and successful hires, with potential gamification (leaderboards, badges).
- **Add Notes**: Include personalized messages in referral links.

### For Recruiters

- **Create Company Profiles**: Set up a company profile using a verified company email.
- **Post Jobs**: Publish job listings from a dashboard, visible to all users (logged-in or logged-out).
- **Manage Applications**: Receive notifications for applications and referrals (e.g., “User X referred by Employee Y for Position Z”).
- **View Analytics**: Track job views, shares, clicks, and application metrics.

### For Admins

- **Manage Platform**: Block/ban users or recruiters, and oversee users, companies, and referrals.
- **Monitor Metrics**: Analyze job shares, referral success rates, and top Referral Providers.
- **Track Referrals**: View who referred whom for which job.

### General Features

- **Public Job Sharing**: Share jobs without login (visible to logged-out users). Logged-in users’ shares earn points based on views/clicks.
- **Secure Authentication**: Role-based access (User, Recruiter, Admin) with JWT and `httpOnly` cookies.
- **Messaging & Notifications**: In-platform chat and email alerts for referral applications and job updates.
- **Security**: Rate limiting, CAPTCHA for non-logged-in sharing, and referral link expiry.
- **Mobile-Friendly**: Responsive UI with QR code and social sharing (WhatsApp, Telegram).

### Example Workflow

1. **User**: Browses jobs, requests a referral from a Referral Provider at Company X.
2. **Referral Provider**: Generates a referral link for the user’s email, adds a note, and tracks the application.
3. **Recruiter**: Receives the application and referral notification, views the user’s profile, and updates interview status.
4. **User**: Confirms receiving the referral, triggering tracking and updating the provider’s profile.
5. **Admin**: Monitors referrals and bans a user for spam.

For API and component details, see the `frontend/` and `backend/` directories.

## 🤝 Contributing

We welcome contributions! See our documentation:

- [Contribution Guidelines](../CONTRIBUTING.md) - How to contribute
- [Contribution Tracking](./CONTRIBUTION_COUNT.md) - Current progress & roadmap
- [Implementation Checklist](../backend/MultiTenent%20Arch/IMPLEMENTATION_CHECKLIST.md) - What needs to be built

**High Priority Areas**:

- 🔴 Database models & migrations (Organizations, Jobs, Referrals, Applications)
- 🟡 API endpoint implementations
- 🟡 Frontend role-based components
- 🟡 Testing & test coverage

**Contact**: [rutikkulkarni2001@gmail.com](mailto:rutikkulkarni2001@gmail.com)

## 📚 Additional Resources

- [Main README](../README.md) - Project overview
- [Backend README](../backend/README.md) - Backend setup
- [Frontend README](../frontend/README.md) - Frontend setup
- [Multi-Tenant Architecture](../backend/MultiTenent%20Arch/MULTI_TENANT_ARCHITECTURE.md) - Complete specs
- [Quick Reference](../backend/MultiTenent%20Arch/QUICK_REFERENCE.md) - 5-minute overview
- [Security Guide](../backend/SECURITY.md) - Security best practices
