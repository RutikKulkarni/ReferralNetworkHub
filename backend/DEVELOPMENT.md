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

### Connect to MongoDB (Local)

```bash
mongosh mongodb://localhost:27017/referral-network-hub
```

### Connect to MongoDB (Docker)

```bash
docker exec -it rnh-mongodb mongosh referral-network-hub
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
    "role": "user"
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

- `MONGODB_URI` - MongoDB connection string
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
├── config/          # App configuration
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helper functions
├── types/           # TypeScript types
├── app.ts           # Express app
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

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### Module Not Found

```bash
rm -rf node_modules package-lock.json
npm install
```
