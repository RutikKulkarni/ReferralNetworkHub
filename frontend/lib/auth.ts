import axios from "axios";
import { User, RegisterData } from "./types";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;
const AUTH_API = `${API_URL}/api/auth`;

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: any) => void)[] = [];

/**
 * Configure axios instance with auth interceptors
 */
const authApi = axios.create({
  baseURL: AUTH_API,
  withCredentials: true,
});

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      hasRefreshToken() &&
      !originalRequest.url.includes("refresh-token") &&
      !originalRequest.url.includes("me")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((token) => {
            if (token) {
              resolve(authApi(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const res = await authApi.post(`/refresh-token`);
        if (res.status === 200) {
          setIsLoggedInCookie(true);

          refreshSubscribers.forEach((callback) => callback(true));
          refreshSubscribers = [];
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        refreshSubscribers.forEach((callback) => callback(false));
        refreshSubscribers = [];
        clearAuthState();
      } finally {
        isRefreshing = false;
      }
    }

    if (originalRequest.url.includes("me")) {
      clearAuthState();
    }
    return Promise.reject(error);
  }
);

// Helper to check if we likely have a refresh token
function hasRefreshToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("isLoggedIn") === "true";
  }
  return false;
}

// Helper to clear auth state on failed refresh
function clearAuthState() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    Cookies.remove("isLoggedIn");
  }
}

function setIsLoggedInCookie(isLoggedIn: boolean) {
  if (typeof window !== "undefined") {
    const secure = window.location.protocol === "https:";
    const sameSite = secure ? "none" : "lax";

    if (isLoggedIn) {
      Cookies.set("isLoggedIn", "true", {
        path: "/",
        secure: secure,
        sameSite: sameSite as "none" | "lax" | "strict",
        expires: 7,
      });
    } else {
      Cookies.remove("isLoggedIn");
    }
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
      setIsLoggedInCookie(true);
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
      setIsLoggedInCookie(true);
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
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      setIsLoggedInCookie(false);
    }
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await authApi.get("/me", {
      headers: {
        "X-No-Retry-Auth": "true",
      },
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsLoggedInCookie(true);
    }
    return response.data.user;
  } catch (error) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      setIsLoggedInCookie(false);
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
