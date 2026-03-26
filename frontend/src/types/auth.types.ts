/**
 * User Types
 */
export enum UserType {
  PLATFORM_SUPER_ADMIN = "PLATFORM_SUPER_ADMIN",
  PLATFORM_ADMIN = "PLATFORM_ADMIN",
  ORGANIZATION_ADMIN = "ORGANIZATION_ADMIN",
  ORG_RECRUITER = "ORG_RECRUITER",
  EMPLOYEE_REFERRER = "EMPLOYEE_REFERRER",
  JOB_SEEKER = "JOB_SEEKER",
  REFERRAL_PROVIDER = "REFERRAL_PROVIDER",
}

/**
 * User object returned from API
 */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  organizationId?: number;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: string[]; // Array of validation errors
}

/**
 * Auth response data (from login, register, etc.)
 */
export interface AuthResponseData {
  user: User;
  accessToken: string;
  expiresIn: number; // seconds
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: UserType;
  organizationId?: number;
}

/**
 * Auth context state
 */
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
