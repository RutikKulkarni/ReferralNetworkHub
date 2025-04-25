import axios from "axios";
import { User, RegisterData } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;

// Configure axios to include credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
  xsrfCookieName: "",
  xsrfHeaderName: "",
});

// Handle API errors consistently
const handleApiError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.message || "An error occurred");
    // } else if (error.request) {
    //   throw new Error("No response from server. Please check your connection");
  } else {
    throw new Error(error.message || "An error occurred");
  }
};

// Register a new user
export const registerUser = async (userData: RegisterData): Promise<User> => {
  try {
    const response = await api.post("/register", userData);
    return response.data.user;
  } catch (error) {
    handleApiError(error);
    throw error; // This line will never execute but is needed for TypeScript
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data.user;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get("/me");
    return response.data.user;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Refresh token
export const refreshUserToken = async (): Promise<User> => {
  try {
    const response = await api.post("/refresh-token");
    return response.data.user;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/logout");
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Forgot password
export const forgotPassword = async (
  email: string
): Promise<{ message: string }> => {
  try {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (
  token: string,
  email: string,
  newPassword: string
): Promise<{ message: string }> => {
  try {
    const response = await api.post("/reset-password", {
      token,
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Admin functions
export const blockUser = async (
  userId: string,
  reason: string
): Promise<{ message: string; user: User }> => {
  try {
    const response = await api.post(`/admin/users/${userId}/block`, { reason });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const unblockUser = async (
  userId: string
): Promise<{ message: string; user: User }> => {
  try {
    const response = await api.post(`/admin/users/${userId}/unblock`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getBlockedUsers = async (
  page = 1,
  limit = 20
): Promise<{
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}> => {
  try {
    const response = await api.get(
      `/admin/users/blocked?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Check if a user has one of the required roles
export const hasRole = (user: User | null, roles: string[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};
