# Documentation

Welcome to the documentation for ReferralNetworkHub! This document provides an overview of the project structure, setup instructions, and usage guidelines.

## Project Structure

The ReferralNetworkHub project follows a typical directory structure for a Node.js and React.js application. Here's an outline of the main directories and their purposes:

- **backend:** Contains the backend code written in Node.js with Express. Includes API endpoints, middleware, and database configurations.
- **frontend:** Contains the frontend code written in React.js. Includes components, stylesheets, and other client-side assets.
- **Documentation:** Contains project documentation, including README files, contribution guidelines, and code of conduct.
- **tests:** Contains unit tests and integration tests for both backend and frontend code.
- **public:** Contains static assets served by the frontend application, such as images and favicon.
- **LICENSE:** The license file specifying the project's open-source license.
- **README.md:** The main README file providing an overview of the project.
- **CONTRIBUTING.md:** Guidelines for contributing to the project.

## Setup Instructions

To set up ReferralNetworkHub locally for development or testing purposes, follow these steps:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/ReferralNetworkHub.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ReferralNetworkHub
   ```

3. Install dependencies for both backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

4. Create `.env` files in both the `frontend` and `backend` folders:
   - Copy the content from `.env.txt` to the newly created `.env` files in each folder. **Do not make any changes to the content.**

5. Set up the MongoDB database:
   - Install MongoDB locally or use a cloud-based service like MongoDB Atlas.
   - Update the database connection URL in the backend configuration files.

6. Start the backend server:
   ```bash
   cd ../backend
   npm run dev
   ```

7. Start the frontend development server:
   ```bash
   cd ../frontend
   npm start
   ```

8. Access the application in your web browser at `http://localhost:3000`.

## Usage Guidelines

ReferralNetworkHub provides the following features and functionalities for users:

- User registration and authentication: Users can sign up for an account and log in securely.
- Job listings: Users can view available job listings with detailed information.
- Referral tracking: Users can track the status of referrals they've made and manage them accordingly.
- Communication features: Users can communicate with referrers and candidates through messaging.

Please refer to the [README](../README.md) file in the project root for an overview of the project and its features.

For detailed API documentation and frontend component documentation, please refer to the respective directories in this documentation folder.

If you encounter any issues or have any questions, please refer to the [contribution guidelines](CONTRIBUTING.md) for information on how to get help or report problems.
