
# ReferralNetworkHub 🌐

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)


> ##  🚧 Work In Progress<br>
> ### This project is under active development and might include breaking changes.
> Check [open issues](https://github.com/RutikKulkarni/ReferralNetworkHub/issues) to become an early contributor! 👩‍💻👨‍💻

**ReferralNetworkHub** is an open-source platform that revolutionizes job referrals by connecting professionals, enabling seamless networking, and streamlining the hiring process. Users can browse and apply for jobs, request referrals from company employees, and track referral progress, while recruiters create company profiles and post job listings. Built with a microservices architecture and a stunning UI, ReferralNetworkHub offers a secure, scalable, and delightful experience for all users.

## 📖 Overview

ReferralNetworkHub empowers **Users**, **Referral Providers** and **Recruiters** to collaborate in a dynamic job referral ecosystem:
- **Users** browse jobs, apply directly, or request referrals from employees at target companies.
- **Referral Providers** (employees) generate unique referral links for candidates, track referral progress, and earn points for successful referrals.
- **Recruiters** create company profiles, post jobs, and view analytics on applications and referrals.
- **Admins** manage users, recruiters, companies, and platform metrics.

The platform supports public job sharing (even for logged-out users), secure referral tracking, and gamified rewards, making job hunting and hiring intuitive and engaging.

## ✨ Features

### For Users
- **🔍 Job Exploration**: Browse, apply, save, or view recommended jobs in a dedicated jobs section.
- **🤝 Referral Requests**: Request referrals from Referral Providers employed at the job’s company, with profile visibility restricted until a request is made.
- **💬 In-Platform Messaging**: Chat with Referral Providers to discuss job opportunities or share external job IDs/links (requires a complete user profile).
- **📈 Application Tracking**: Monitor application status (e.g., “Interviewing - Round 1”) and referral confirmations.

### For Referral Providers
- **🔗 Referral Links**: Generate single-use referral links for specific candidates (tied to their email) for jobs at their current company only.
- **📊 Referral Dashboard**: Track referral applications, progress (e.g., “Referral in Progress”), and successes (e.g., “1 Successful Referral at Company X”).
- **🏆 Points & Rewards**: Earn points for sharing jobs, generating referrals, and successful hires, with potential for leaderboards or badges.
- **📝 Custom Notes**: Add personalized messages to referral links for candidates.

### For Recruiters
- **🏢 Company Profiles**: Create and manage company profiles using a verified company email.
- **📢 Job Posting**: Post jobs from a recruiter dashboard, visible to all users (logged-in or logged-out).
- **📩 Application Notifications**: Receive messages when users apply or when Referral Providers submit referrals (e.g., “User referred by Employee X for Position Y”).
- **📊 Analytics Dashboard**: View job views, shares, clicks, and application metrics.

### For Admins
- **🛠️ Control Panel**: Manage users, recruiters, companies, and referrals, including blocking/banning users.
- **📈 Platform Metrics**: Track job shares, referral success rates, and top Referral Providers.
- **🔍 Referral Oversight**: View who referred whom for which job and company.

### General Features
- **🔒 Secure Authentication**: Role-based access (User, Recruiter, Admin) with JWT and `httpOnly` cookies.
- **🌍 Public Job Sharing**:
  - Share jobs publicly without login, visible to logged-out users.
  - Logged-in users’ shares are trackable for points (based on views, clicks, etc.).
- **🔐 Security**: Rate limiting, CAPTCHA for non-logged-in sharing, and referral link expiry to prevent abuse.
- **📱 Mobile Compatibility**: Responsive design with sharing options (copy link, QR code, WhatsApp/Telegram).
- **📧 Email Notifications**: Notify Referral Providers and Recruiters about referral applications and job updates.
- **🎨 Beautiful UI**: Modern, intuitive interface powered by Tailwind CSS and shadcn/ui components.

## 🛠️ Technologies Used

### Frontend
- **Next.js (15.2.4)**: React framework with App Router for SSR and static site generation.
- **TypeScript**: Static typing for robust, maintainable code.
- **Tailwind CSS**: Utility-first CSS for rapid, responsive styling.
- **shadcn/ui**: Accessible, customizable UI components for a polished interface.
- **Axios**: HTTP client for secure, cookie-based API requests.

### Backend
- **Node.js (22.13.0)**: JavaScript runtime for scalable microservices.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: NoSQL database for users, jobs, referrals, and analytics.
- **Mongoose**: ODM for MongoDB schema and query management.
- **JWT**: Secure authentication with `httpOnly`, `secure`, and `sameSite` cookies.
- **Microservices Architecture**: Modular services (e.g., `auth-service`, `job-service`) for scalability.

### Other Tools
- **Git**: Version control for collaboration.
- **Docker (optional)**: Containerization for consistent environments.

## 🚀 Getting Started

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

## 🖌️ Design Philosophy

ReferralNetworkHub prioritizes a **beautiful, user-centric UI**:
- **Tailwind CSS**: Enables consistent, responsive styling.
- **shadcn/ui**: Provides reusable components (e.g., buttons, modals, dashboards) for a modern aesthetic.
- **Responsive Design**: Optimized for desktops, tablets, and mobiles.

## 🤝 Contributing

We welcome contributions from developers, designers, and enthusiasts! Help us build a vibrant referral community:
- **Code Contributions**: See the [Contribution Guidelines](./CONTRIBUTING.md) for pull request details.
- **Feedback**: Open issues for bugs, features, or suggestions. [Submit an issue](https://github.com/RutikKulkarni/ReferralNetworkHub/issues/new).

## 📜 License

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the [MIT License](./LICENSE).

## 📬 Contact

Questions or ideas? Reach out:
- **Email**: [rutikkulkarni2001@gmail.com](mailto:rutikkulkarni2001@gmail.com)
- **GitHub Issues**: [Submit an issue](https://github.com/RutikKulkarni/ReferralNetworkHub/issues/new)

Join now in transforming job referrals and professional networking! 🌟
