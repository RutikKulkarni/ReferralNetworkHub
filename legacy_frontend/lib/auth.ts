import axios from "axios";
import { User, RegisterData } from "./types";

const API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL;
const AUTH_API = `${API_URL}/api/auth`;

let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

/**
 * Get tokens from localStorage
 */
const getTokens = () => {
  if (typeof window === "undefined")
    return { accessToken: null, refreshToken: null };

  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };
};

/**
 * Set tokens in localStorage
 */
const setTokens = (accessToken: string | null, refreshToken: string | null) => {
  if (typeof window === "undefined") return;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  } else {
    localStorage.removeItem("accessToken");
  }

  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  } else {
    localStorage.removeItem("refreshToken");
  }
};

/**
 * Configure axios instance with auth interceptors
 */
const authApi = axios.create({
  baseURL: AUTH_API,
});

// Request interceptor to add bearer token
authApi.interceptors.request.use(
  (config) => {
    const { accessToken } = getTokens();
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      hasRefreshToken() &&
      !originalRequest.url.includes("refresh-token")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(authApi(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        const { refreshToken } = getTokens();
        const response = await authApi.post("/refresh-token", { refreshToken });

        if (response.data.success) {
          const { accessToken: newAccessToken } = response.data;
          setTokens(newAccessToken, refreshToken);

          // Update localStorage flags
          localStorage.setItem("isLoggedIn", "true");
          if (response.data.user) {
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }

          refreshSubscribers.forEach((callback) => callback(newAccessToken));
          refreshSubscribers = [];

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        refreshSubscribers.forEach((callback) => callback(null));
        refreshSubscribers = [];
        clearAuthState();
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Helper to check if we have a refresh token
 */
function hasRefreshToken(): boolean {
  if (typeof window !== "undefined") {
    const { refreshToken } = getTokens();
    return !!refreshToken;
  }
  return false;
}

/**
 * Helper to clear auth state
 */
function clearAuthState(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
  }
}

/**
 * Register a new user
 */
export const registerUser = async (
  userData: RegisterData
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  try {
    const response = await authApi.post("/register", userData);
    const { user, accessToken, refreshToken } = response.data;

    if (typeof window !== "undefined") {
      setTokens(accessToken, refreshToken);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(user));
    }

    return { user, accessToken, refreshToken };
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
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  try {
    const response = await authApi.post("/login", { email, password });
    const { user, accessToken, refreshToken } = response.data;

    if (typeof window !== "undefined") {
      setTokens(accessToken, refreshToken);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(user));
    }

    return { user, accessToken, refreshToken };
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
    const { refreshToken } = getTokens();
    if (refreshToken) {
      await authApi.post("/logout", { refreshToken });
    }
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    clearAuthState();
  }
};

/**
 * Validate current access token
 */
export const validateAccessToken = async (token: string): Promise<User> => {
  try {
    const response = await authApi.post(
      "/validate-token",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    clearAuthState();
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
