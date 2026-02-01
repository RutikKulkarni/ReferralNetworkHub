# Backend Development Guide

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration
```

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

Server will run on http://localhost:5000 with hot reload.

### Production Mode

```bash
npm run build
npm start
```

## 🐳 Docker

### Development with Docker

```bash
docker-compose up -d
```

### View Logs

```bash
docker-compose logs -f backend
```

### Stop Services

```bash
docker-compose down
```

### Rebuild After Changes

```bash
docker-compose up -d --build
```

## 🗄️ Database

### Connect to PostgreSQL (Local)

```bash
psql -h localhost -p 5432 -U postgres -d referral_network_hub
```

### Connect to PostgreSQL (Docker)

```bash
docker exec -it rnh-postgres psql -U postgres -d referral_network_hub
```

### Run Migrations

```bash
npm run migrate
```

### Seed Database

```bash
npm run seed
```

## 📝 API Testing

### Health Check

```bash
curl http://localhost:5000/health
```

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "JOB_SEEKER"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

## 🔐 Environment Variables

See [.env.example](.env.example) for all available configuration options.

### Required Variables

- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: referral_network_hub)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens

### Optional Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS
- Email configuration for password reset

## 🏗️ Project Structure

```
src/
├── config/          # App configuration (database, redis, swagger)
├── constants/       # Application constants
├── database/        # Database migrations and seeders
├── modules/         # Feature modules
│   ├── auth/        # Authentication module
│   ├── jobs/        # Jobs module
│   ├── organization/# Organization module
│   ├── platform/    # Platform admin module
│   └── referrals/   # Referrals module
├── shared/          # Shared resources
│   ├── middleware/  # Custom middleware
│   ├── types/       # TypeScript types
│   └── utils/       # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### PostgreSQL Connection Issues

- Ensure PostgreSQL is running
- Check DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD in .env
- Verify database exists: `psql -U postgres -c "CREATE DATABASE referral_network_hub;"`
- Check PostgreSQL logs for connection errors

### Module Not Found

```bash
rm -rf node_modules package-lock.json
npm install
```
