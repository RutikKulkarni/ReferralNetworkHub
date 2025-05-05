export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "recruiter" | "admin";
  companyName?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "user" | "recruiter" | "admin";
  companyName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}
