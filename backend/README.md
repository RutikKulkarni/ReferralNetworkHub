# Referral Network Hub - Backend

Monolith backend API for the Referral Network Hub platform.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe development
- **PostgreSQL** - Relational database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Nodemailer** - Email service

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
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
- `POST /validate-token` - Validate access token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password

### Admin (`/api/admin`)

- `GET /users` - Get all users (Admin)
- `GET /users/blocked` - Get blocked users (Admin)
- `PUT /users/:userId/block` - Block user (Admin)
- `PUT /users/:userId/unblock` - Unblock user (Admin)

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
