import axios from "axios";
import { User, RegisterData } from "./types";
const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;
const AUTH_API = `${API_URL}/api/auth`;

/**
 * Configure axios instance with auth interceptors
 */
const authApi = axios.create({
  baseURL: AUTH_API,
  withCredentials: true,
});

// Add response interceptor to handle unsuccessful requests
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      hasRefreshToken()
    ) {
      originalRequest._retry = true;
      try {
        const res = await authApi.post(`/refresh-token`);
        if (res.status === 200) {
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        clearAuthState();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Helper to check if we likely have a refresh token
function hasRefreshToken() {
  if (typeof window !== "undefined") {
    // Check for a flag in localStorage
    return localStorage.getItem("isLoggedIn") === "true";
    // If you're using an auth state in memory
    // return !!currentUser;
  }
  return false;
}

// Helper to clear auth state on failed refresh
function clearAuthState() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isLoggedIn");
  }
}

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterData): Promise<User> => {
  try {
    const response = await authApi.post("/register", userData);
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
    }
    return response.data.user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

/**
 * Login a user
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const response = await authApi.post("/login", { email, password });
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
    }
    return response.data.user;
  } catch (error: any) {
    if (error.response?.data?.isBlocked) {
      throw new Error(
        `Account blocked: ${
          error.response.data.reason || "Please contact support."
        }`
      );
    }
    throw new Error(error.response?.data?.message || "Invalid credentials");
  }
};

/**
 * Logout a user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await authApi.post("/logout");
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
    }
  } catch (error) {
    console.error("Logout API error:", error);
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
    }
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await authApi.get("/me");
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
    }
    return response.data.user;
  } catch (error) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
    }
    throw error;
  }
};

/**
 * Request password reset
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await authApi.post("/forgot-password", { email });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Password reset request failed"
    );
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  email: string,
  newPassword: string
): Promise<void> => {
  try {
    await authApi.post("/reset-password", {
      token,
      email,
      newPassword,
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Password reset failed");
  }
};

/**
 * Function to check if user has required permissions
 */
export const hasPermission = (
  user: User | null,
  requiredRoles: string[]
): boolean => {
  if (!user) return false;
  if (user.role === "admin") return true;
  return requiredRoles.includes(user.role);
};
