# Referral Network Hub - Backend

Monolith backend API for the Referral Network Hub platform.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **Sequelize** - ORM
- **Redis** - Session management & caching
- **JWT** - Authentication & authorization
- **Nodemailer** - Email service
- **Swagger** - API documentation

## 🏛️ Multi-Tenant Architecture

This backend is designed as a **multi-tenant platform** combining:

- 🏛️ **HR Management System (HRMS)** - Complete employee lifecycle
- 🤝 **Employee Referral Network** - Internal & cross-organization referrals
- 📊 **Unified Recruiter Dashboard** - All applications in one view
- 👥 **Multi-level Administration** - Platform, organization, and recruiter roles

### User Hierarchy

```
PLATFORM_SUPER_ADMIN (System owner)
  └─ PLATFORM_ADMIN (Operations)
      └─ ORGANIZATION_ADMIN (HR & recruitment oversight)
          ├─ ORG_RECRUITER (Hiring management)
          └─ EMPLOYEE_REFERRER (Active employees)

JOB_SEEKER (External candidates)
REFERRAL_PROVIDER (Non-employee referrers)
```

### Implementation Status

✅ **Completed**:

- User authentication & authorization
- Multi-user type support (7 types)
- Session management with Redis
- Role-based access control
- Organization context handling
- Invite system foundation

⚠️ **In Progress** (See [IMPLEMENTATION_CHECKLIST.md](./MultiTenent%20Arch/IMPLEMENTATION_CHECKLIST.md)):

- Database schema (organizations, jobs, referrals, applications)
- Core business models & relationships
- API endpoints for HR, jobs, applications, referrals
- Tenant isolation middleware
- Complete multi-tenant workflows

📚 **Documentation**: See [MultiTenent Arch/](./MultiTenent%20Arch/) for complete architecture specs.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # Database configuration
│   │   ├── redis.ts     # Redis configuration
│   │   └── swagger.ts   # Swagger/OpenAPI setup
│   ├── constants/       # Application constants
│   ├── database/        # Migrations & seeders
│   ├── modules/         # Feature modules
│   │   ├── auth/        # Authentication & authorization
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── jobs/        # Job management (planned)
│   │   ├── organization/# Organization management (planned)
│   │   ├── platform/    # Platform admin
│   │   └── referrals/   # Referral system (planned)
│   ├── shared/          # Shared resources
│   │   ├── middleware/  # Global middleware
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── MultiTenent Arch/   # Architecture documentation
│   ├── MULTI_TENANT_ARCHITECTURE.md
│   ├── IMPLEMENTATION_CHECKLIST.md
│   ├── QUICK_REFERENCE.md
│   └── DOCS_INDEX.md
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript configuration
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v20+)
- PostgreSQL (v14+)
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and update with your configuration.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and start services**

   ```bash
   docker-compose up -d
   ```

2. **View logs**

   ```bash
   docker-compose logs -f backend
   ```

3. **Stop services**
   ```bash
   docker-compose down
   ```

## 📚 API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `POST /logout` - User logout
- `POST /logout-all` - Logout from all devices
- `POST /validate-token` - Validate access token
- `GET /sessions` - Get active sessions
- `DELETE /sessions/:sessionId` - Revoke specific session
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `POST /verify-email` - Verify email address
- `POST /resend-verification` - Resend verification email

### Invitations (`/api/auth/invites`)

- `POST /org-admin` - Invite organization admin (Super Admin)
- `POST /recruiter` - Invite recruiter (Org Admin)
- `POST /employee` - Invite employee (Org Admin/Recruiter)
- `POST /accept/:token` - Accept invitation

### Platform Admin (`/api/admin`)

- `GET /users` - Get all users
- `GET /users/blocked` - Get blocked users
- `PATCH /users/:userId/block` - Block user
- `PATCH /users/:userId/unblock` - Unblock user

### ⚠️ Planned Endpoints (In Development)

**Organizations** (`/api/organizations`):

- Create, list, update organizations
- Manage organization admins
- Organization statistics

**Jobs** (`/api/jobs`):

- Post and manage job listings
- Search jobs across organizations
- Application management

**Referrals** (`/api/referrals`):

- Create referrals
- Track referral status
- Bonus management

**HR Management** (`/api/hr`):

- Employee onboarding/offboarding
- Department management
- Organization chart

See [MULTI_TENANT_ARCHITECTURE.md](./MultiTenent%20Arch/MULTI_TENANT_ARCHITECTURE.md) for complete API specifications.

## 🔒 Environment Variables

| Variable                 | Description          | Default               |
| ------------------------ | -------------------- | --------------------- |
| `PORT`                   | Server port          | 5000                  |
| `NODE_ENV`               | Environment          | development           |
| `DB_HOST`                | PostgreSQL host      | localhost             |
| `DB_PORT`                | PostgreSQL port      | 5432                  |
| `DB_NAME`                | Database name        | referral_network_hub  |
| `DB_USER`                | Database user        | postgres              |
| `DB_PASSWORD`            | Database password    | postgres              |
| `REDIS_HOST`             | Redis host           | localhost             |
| `REDIS_PORT`             | Redis port           | 6379                  |
| `REDIS_PASSWORD`         | Redis password       | -                     |
| `JWT_SECRET`             | JWT secret key       | -                     |
| `JWT_REFRESH_SECRET`     | JWT refresh secret   | -                     |
| `JWT_ACCESS_EXPIRES_IN`  | Access token expiry  | 1h                    |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | 7d                    |
| `CLIENT_URL`             | Frontend URL         | http://localhost:3000 |
| `EMAIL_HOST`             | SMTP host            | -                     |
| `EMAIL_PORT`             | SMTP port            | 587                   |
| `EMAIL_USER`             | SMTP username        | -                     |
| `EMAIL_PASSWORD`         | SMTP password        | -                     |
| `EMAIL_FROM`             | Sender email         | -                     |

## 🔧 Development

For detailed development instructions, see [DEVELOPMENT.md](./DEVELOPMENT.md).

For architecture and implementation details, see [MultiTenent Arch/DOCS_INDEX.md](./MultiTenent%20Arch/DOCS_INDEX.md).

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run clean` - Clean build directory
- `npm run lint` - Run ESLint

## 🤝 Contributing

Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.
