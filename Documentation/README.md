# Documentation

Welcome to the documentation for **ReferralNetworkHub**! This guide provides an overview of the project structure, setup instructions, and usage guidelines for developers and contributors.

## 📂 Project Structure 
> Note: The project is under active development, and the structure may evolve as new features (e.g., additional microservices, UI components) are added.

ReferralNetworkHub is built with a modern, modular architecture, separating the frontend (Next.js) and backend (Node.js microservices). Below is the directory structure:

- **`frontend/`**: Contains the Next.js frontend code.
  - `app/`: Next.js App Router for pages and layouts (e.g., `login.tsx`, `dashboard.tsx`).
  - `components/`: Reusable UI components using shadcn/ui and Tailwind CSS.
  - `contexts/`: React contexts (e.g., `AuthContext.tsx` for authentication).
  - `lib/`: Utility functions and API clients (e.g., `auth.ts` for Axios).
  - `public/`: Static assets (e.g., images, favicon).
- **`backend/`**: Contains Node.js microservices (e.g., `auth-service`, `job-service`).
  - `services/auth-service/`: Authentication microservice (Express APIs, MongoDB).
    - `controllers/`: API logic (e.g., `auth.controller.ts`).
    - `models/`: Mongoose schemas (e.g., `user.model.ts`).
    - `routes/`: API routes (e.g., `auth.routes.ts`).
    - `middleware/`: Custom middleware (e.g., `auth.ts` for JWT).
  - `services/job-service/` (example): Job posting and referral microservice.
- **`Documentation/`**: Project documentation.
  - `README.md`: This file.
  - `CONTRIBUTING.md`: Contribution guidelines.
- **`LICENSE`**: MIT License file.
- **`README.md`**: Main project README with overview and features.

## 🛠️ Setup Instructions

To set up **ReferralNetworkHub** locally, follow the detailed instructions in:
- [Frontend README](./frontend/README.md) (Next.js, Tailwind CSS, shadcn/ui)
- [Backend README](./backend/README.md) (Node.js microservices, MongoDB)

### Prerequisites
- **Node.js**: v22.13.0 or higher
- **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas)
- **Git**: For cloning and contributing

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/RutikKulkarni/ReferralNetworkHub.git
   cd ReferralNetworkHub
   ```
2. Set up the frontend ([Frontend README](./frontend/README.md)).
3. Set up the backend microservices ([Backend README](./backend/README.md)).
4. Explore the [Flowchart](#) for user interactions.

For detailed setup, refer to:
- [Frontend README](../frontend/README.md)
- [Backend README](../backend/README.md)

## 📘 Usage Guidelines

ReferralNetworkHub offers a rich set of features for **Users**, **Referral Providers**, **Recruiters**, and **Admins**, designed to streamline job referrals and professional networking.

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

We welcome contributions! Refer to the [Contribution Guidelines](../CONTRIBUTING.md) for details on:
- Submitting code (pull requests).
- Reporting issues or suggesting features.

Contact at [rutikkulkarni2001@gmail.com](mailto:rutikkulkarni2001@gmail.com).
