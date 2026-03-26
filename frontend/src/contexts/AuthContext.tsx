"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  useLogin as useLoginMutation,
  useRegister as useRegisterMutation,
  useLogout as useLogoutMutation,
  useRefreshToken,
  useCurrentUser,
} from "@/hooks/useAuthQueries";
import { setAccessToken, clearAccessToken } from "@/lib/axios";
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthState,
} from "@/types/auth.types";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [accessToken, setAccessTokenState] = React.useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(true);

  // Query hooks
  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const refreshTokenMutation = useRefreshToken();
  const { refetch: refetchUser } = useCurrentUser();

  // Derived state
  const isAuthenticated = !!user && !!accessToken;

  // Load user from localStorage and attempt token refresh on mount
  React.useEffect(() => {
    const initAuth = async () => {
      try {
        // Load user from localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Try to refresh access token (cookie sent automatically)
        const result = await refreshTokenMutation.mutateAsync();
        setAccessToken(result);
        setAccessTokenState(result);

        // Fetch fresh user data
        const { data: userData } = await refetchUser();
        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch {
        // No valid refresh token - user not logged in
        console.log("No active session");
        setUser(null);
        setAccessTokenState(null);
        clearAccessToken();
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Listen for logout events from axios interceptor
  React.useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setAccessTokenState(null);
      localStorage.removeItem("user");
      router.push("/login");
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [router]);

  // Login function
  const login = React.useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const data = await loginMutation.mutateAsync(credentials);

        // Update state
        setUser(data.user);
        setAccessTokenState(data.accessToken);
      } catch (error) {
        const err = error as { response?: { data?: { error?: string } } };
        throw new Error(err.response?.data?.error || "Login failed");
      }
    },
    [loginMutation],
  );

  // Register function
  const register = React.useCallback(
    async (userData: RegisterData) => {
      try {
        // Backend now returns message only (no tokens)
        // User must verify email before they can login
        await registerMutation.mutateAsync(userData);

        // Do NOT update state - user needs to verify email first
        // User will login after verification
      } catch (error) {
        const err = error as { response?: { data?: { error?: string } } };
        throw new Error(err.response?.data?.error || "Registration failed");
      }
    },
    [registerMutation],
  );

  // Logout function
  const logout = React.useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();

      // Clear state
      setUser(null);
      setAccessTokenState(null);

      // Redirect to login
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [logoutMutation, router]);

  // Refresh auth (used for manual refresh)
  const refreshAuth = React.useCallback(async () => {
    try {
      const result = await refreshTokenMutation.mutateAsync();
      setAccessToken(result);
      setAccessTokenState(result);

      // Refetch user data
      const { data: userData } = await refetchUser();
      if (userData) {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Refresh failed:", error);
      setUser(null);
      setAccessTokenState(null);
      clearAccessToken();
      localStorage.removeItem("user");
      throw error;
    }
  }, [refreshTokenMutation, refetchUser]);

  const value = React.useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshAuth,
    }),
    [
      user,
      accessToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
