"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshUserToken,
  getCurrentUser,
  forgotPassword as apiRequestPasswordReset,
  resetPassword as apiResetPassword,
} from "@/lib/auth";

export interface User {
  id: string;
  email: string;
  role: "user" | "admin" | "recruiter";
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    email: string,
    newPassword: string
  ) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: "user" | "recruiter" | "admin";
  companyName?: string;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
  forgotPassword: async () => {},
  resetPassword: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        // Try to get current user from token
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        // Token is invalid or expired
        setUser(null);
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!user) return;

    // Refresh token every 45 minutes (to ensure we refresh before 1 hour expiry)
    const refreshInterval = setInterval(async () => {
      try {
        const userData = await refreshUserToken();
        setUser(userData);
      } catch (err) {
        // If refresh fails, log out user
        setUser(null);
        console.error("Token refresh failed:", err);
      }
    }, 45 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await loginUser(email, password);
      setUser(userData);
    } catch (err: any) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await registerUser(userData);
      setUser(newUser);
    } catch (err: any) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
    } catch (err: any) {
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      // await forgotPassword(email);
      await apiRequestPasswordReset(email);
    } catch (err: any) {
      setError(err.message || "Password reset request failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    token: string,
    email: string,
    newPassword: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      await resetPassword(token, email, newPassword);
    } catch (err: any) {
      setError(err.message || "Password reset failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        clearError,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Add a higher-order component for protected routes
import { useRouter } from "next/navigation";

export const withAuth = (Component: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace("/login");
      }
    }, [loading, isAuthenticated, router]);

    if (loading) {
      return <div>Loading...</div>; // You can replace this with a proper loading component
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };

  return AuthenticatedComponent;
};

// Add role-based authorization
export const withRole = (
  Component: React.ComponentType<any>,
  allowedRoles: string[]
) => {
  const AuthorizedComponent = (props: any) => {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.replace("/login");
        } else if (user && !allowedRoles.includes(user.role)) {
          router.replace("/unauthorized");
        }
      }
    }, [loading, isAuthenticated, user, router]);

    if (loading) {
      return <div>Loading...</div>; // You can replace this with a proper loading component
    }

    return isAuthenticated && user && allowedRoles.includes(user.role) ? (
      <Component {...props} />
    ) : null;
  };

  return AuthorizedComponent;
};
