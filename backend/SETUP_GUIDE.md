# 🚀 Backend Setup & Installation Guide

## Complete Authentication System Implementation

This guide covers the complete professional backend setup for ReferralNetworkHub with comprehensive authentication, session management, and activity logging.

## ✨ What's Implemented

### 1. **8 User Types with Hierarchical Access**

- ✅ PLATFORM_SUPER_ADMIN (No session tracking - highest security)
- ✅ PLATFORM_ADMIN (Session tracked)
- ✅ ORGANIZATION_ADMIN (Session tracked)
- ✅ ORG_RECRUITER (Session tracked)
- ✅ EMPLOYEE_REFERRER (Session tracked)
- ✅ JOB_SEEKER (Session tracked)
- ✅ REFERRAL_PROVIDER (Session tracked)

### 2. **Complete Authentication System**

- ✅ User registration with password strength validation
- ✅ Login with JWT access + refresh tokens
- ✅ Logout with session cleanup
- ✅ Token refresh mechanism
- ✅ Forgot password with reset tokens
- ✅ Password reset functionality
- ✅ Change password (authenticated)
- ✅ Email verification (structure ready)

### 3. **Session Management** (All users except Platform Super Admin)

- ✅ Track login/logout timestamps
- ✅ Device detection (type, browser, OS, versions)
- ✅ IP address logging
- ✅ User agent parsing
- ✅ Device fingerprinting
- ✅ Maximum 5 active sessions per user
- ✅ Session status management (active, expired, logged_out, revoked)
- ✅ Automatic session expiry
- ✅ Manual session revocation

### 4. **Activity Logging** (Audit Trail)

- ✅ 40+ activity types tracked
- ✅ Authentication activities (login, logout, token refresh)
- ✅ User management activities
- ✅ Organization management
- ✅ Employee & recruiter management
- ✅ Job & application management
- ✅ Referral management
- ✅ JSONB metadata for flexible context
- ✅ Immutable logs (can't be modified)
- ✅ IP address and user agent tracking per activity

### 5. **Security Features**

- ✅ bcrypt password hashing (12 rounds)
- ✅ JWT token versioning
- ✅ Password strength validation
- ✅ Common password detection
- ✅ Rate limiting (100 req/15min per IP)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Token expiry management
- ✅ Refresh token rotation

## 📁 Complete File Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── index.ts                    # Environment configuration
│   │   └── database.ts                 # Sequelize setup
│   ├── constants/
│   │   └── index.ts                    # All constants (2390 lines)
│   ├── types/
│   │   └── index.ts                    # TypeScript definitions (1873 lines)
│   ├── models/
│   │   ├── user.model.ts               # User model (8 types)
│   │   ├── user-session.model.ts       # Session tracking
│   │   ├── user-activity-log.model.ts  # Activity logs
│   │   ├── refresh-token.model.ts      # JWT refresh tokens
│   │   ├── password-reset.model.ts     # Password reset tokens
│   │   └── index.ts
│   ├── utils/
│   │   ├── jwt.utils.ts                # JWT utilities
│   │   ├── password.utils.ts           # Password hashing
│   │   ├── device.utils.ts             # Device detection
│   │   └── index.ts
│   ├── services/
│   │   ├── auth.service.ts             # Authentication logic
│   │   ├── session.service.ts          # Session management
│   │   ├── activity-log.service.ts     # Activity tracking
│   │   └── index.ts
│   ├── controllers/
│   │   ├── auth.controller.ts          # Auth HTTP handlers
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts          # JWT verification
│   │   ├── activity-log.middleware.ts  # Auto logging
│   │   └── index.ts
│   ├── routes/
│   │   ├── auth.routes.ts              # Auth endpoints
│   │   └── index.ts
│   ├── app.ts                          # Express app
│   └── index.ts                        # Server entry
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation Steps

### Step 1: Install Dependencies

```bash
cd backend
npm install
```

**Required packages:**

- express
- pg, pg-hstore, sequelize (PostgreSQL)
- bcrypt (password hashing)
- jsonwebtoken (JWT tokens)
- cors, helmet (security)
- express-rate-limit (rate limiting)
- uuid (session IDs)
- dotenv (environment variables)
- TypeScript dependencies

### Step 2: Setup PostgreSQL Database

1. **Install PostgreSQL** (if not installed)
   - Download from https://www.postgresql.org/download/
   - Or use Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16-alpine`

2. **Create Database**

```bash
# Using psql
psql -U postgres
CREATE DATABASE referral_network_hub;
\q
```

### Step 3: Configure Environment Variables

1. **Copy example env file**

```bash
cp .env.example .env
```

2. **Edit `.env` file** with your settings:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=referral_network_hub
DB_USER=postgres
DB_PASSWORD=your_database_password

# JWT Secrets (MUST CHANGE IN PRODUCTION!)
JWT_ACCESS_TOKEN_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_ACCESS_TOKEN_EXPIRY=1h
JWT_REFRESH_TOKEN_EXPIRY=7d

# Session
SESSION_EXPIRY_SECONDS=3600
MAX_ACTIVE_SESSIONS_PER_USER=5

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Run Database Migrations

The server will automatically create all tables on first run. Tables created:

1. **users** - User accounts (8 types)
2. **user_sessions** - Session tracking
3. **user_activity_logs** - Activity audit trail
4. **refresh_tokens** - JWT refresh token storage
5. **password_resets** - Password reset tokens

### Step 5: Start the Server

**Development mode (with hot reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

Server will start on `http://localhost:5000`

### Step 6: Test the API

**Health check:**

```bash
curl http://localhost:5000/health
```

**Register a user:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "SecurePass123!",
    "firstName": "Admin",
    "lastName": "User",
    "userType": "PLATFORM_ADMIN"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "SecurePass123!"
  }'
```

## 📡 API Endpoints Summary

### Public (No Auth)

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Protected (Auth Required)

- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/sessions` - Get user sessions
- `GET /api/auth/activity` - Get user activity logs
- `POST /api/auth/sessions/:id/revoke` - Revoke specific session

## 🔑 Authentication Flow

### Registration Flow

1. User submits registration data
2. Password validated (strength, common passwords, user info)
3. Password hashed with bcrypt
4. User created in database
5. Session created (if tracking enabled)
6. JWT tokens generated
7. Activity logged

### Login Flow

1. User submits credentials
2. User found and verified (active, not blocked)
3. Password compared with bcrypt
4. Session created with device info
5. JWT tokens generated
6. Last login updated
7. Activity logged

### Token Refresh Flow

1. Client sends refresh token
2. Token verified (expiry, revocation)
3. User validated (active, not blocked, token version)
4. New token pair generated
5. Old refresh token revoked
6. New refresh token stored
7. Session activity updated

### Logout Flow

1. Client sends logout request
2. Session marked as logged_out
3. Refresh tokens revoked
4. Activity logged

## 🎯 Session Tracking Details

### What's Tracked (All users except Platform Super Admin)

**Session Information:**

- Unique session ID (UUID)
- Login timestamp
- Logout timestamp (if logged out)
- Last activity timestamp
- Expiry timestamp
- Session status (active/expired/logged_out/revoked)

**Device Information:**

- Device type (Desktop/Mobile/Tablet)
- Browser (Chrome/Firefox/Safari/Edge/etc.)
- Browser version
- Operating System (Windows/Mac/Linux/iOS/Android)
- OS version
- Full user agent string
- Device fingerprint (for tracking same device)

**Network Information:**

- IP address (INET type for efficient storage)

**Limitations:**

- Maximum 5 active sessions per user
- Sessions automatically expire after 1 hour of inactivity
- Oldest session automatically removed when limit reached

### Session Management API

```bash
# Get all user sessions
GET /api/auth/sessions
Authorization: Bearer {access_token}

# Revoke specific session
POST /api/auth/sessions/{session_id}/revoke
Authorization: Bearer {access_token}
```

## 📊 Activity Logging Details

### 40+ Activity Types Tracked

**Authentication:**

- LOGIN, LOGIN_FAILED, LOGOUT
- TOKEN_REFRESHED
- PASSWORD_CHANGED, PASSWORD_RESET, PASSWORD_RESET_REQUESTED
- EMAIL_VERIFIED

**User Management:**

- USER_CREATED, USER_UPDATED, USER_DELETED
- USER_BLOCKED, USER_UNBLOCKED
- ROLE_CHANGED

**Organization Management:**

- ORG_CREATED, ORG_UPDATED, ORG_DELETED
- ORG_SETTINGS_CHANGED

**And many more...**

### Activity Log Structure

Each activity log entry contains:

- User ID
- Session ID (if applicable)
- Activity type
- Description (human-readable)
- IP address
- User agent
- Metadata (JSONB - flexible data)
- Timestamp (immutable)

### Activity API

```bash
# Get user activity logs
GET /api/auth/activity?limit=50&offset=0
Authorization: Bearer {access_token}

Response includes:
- Activity type
- Description
- Timestamp
- IP address
- Device info
- Metadata
```

## 🔐 Security Best Practices

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- No whitespace
- Not a common password
- Doesn't contain user info (email, name)

### JWT Configuration

- Access tokens: 1 hour expiry
- Refresh tokens: 7 days expiry
- Token versioning for invalidation
- Issuer and audience validation

### Rate Limiting

- 100 requests per 15 minutes per IP
- Applied to all /api/ routes
- Returns 429 status when exceeded

### Session Security

- Automatic expiry after inactivity
- Manual revocation available
- Token version check on refresh
- All sessions revoked on password change

## 🧪 Testing Checklist

- [ ] Database connection successful
- [ ] User registration works
- [ ] Login returns JWT tokens
- [ ] Session created on login
- [ ] Device info parsed correctly
- [ ] Activity logged on actions
- [ ] Token refresh works
- [ ] Logout clears session
- [ ] Password change invalidates old tokens
- [ ] Session revocation works
- [ ] Rate limiting prevents abuse
- [ ] Password reset flow complete

## 📈 Next Steps

1. **Add Email Service** - Send verification, password reset emails
2. **Add User Management Endpoints** - CRUD for users
3. **Add Organization Module** - Multi-tenant organization management
4. **Add Job Module** - Job postings and applications
5. **Add Referral Module** - Referral submission and tracking
6. **Add Admin Dashboard** - Manage users, view analytics
7. **Add Notification Service** - Real-time notifications
8. **Add File Upload** - Resume, documents
9. **Add Search & Filters** - Advanced filtering
10. **Add Analytics** - User activity, session analytics

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Check connection
psql -U postgres -d referral_network_hub
```

### JWT Token Errors

- Ensure JWT secrets are set in .env
- Check token expiry times
- Verify token version matches

### Session Not Created

- Verify user type is not PLATFORM_SUPER_ADMIN
- Check database connection
- Review server logs

## 📞 Support

For issues or questions:

1. Check server logs
2. Review error messages
3. Verify environment variables
4. Check database connectivity

---

**🎉 Congratulations! Your professional authentication backend is ready!**
