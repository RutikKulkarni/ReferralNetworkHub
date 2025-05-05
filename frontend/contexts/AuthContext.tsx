"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  forgotPassword as apiRequestPasswordReset,
  resetPassword as apiResetPassword,
} from "@/lib/auth";
import { User, RegisterData } from "@/lib/types";
import { useRouter } from "next/navigation";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: (redirectPath?: string) => Promise<void>;
  clearError: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    email: string,
    newPassword: string
  ) => Promise<void>;
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
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        setUser(null);
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

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

  const logout = useCallback(
    async (redirectPath = "/") => {
      try {
        setLoading(true);
        await logoutUser();
        setUser(null);
        router.push(redirectPath);
      } catch (err: any) {
        setError(err.message || "Logout failed");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
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
      await apiResetPassword(token, email, newPassword);
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

export const withAuth = (Component: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace(
          `/login?from=${encodeURIComponent(window.location.pathname)}`
        );
      }
    }, [loading, isAuthenticated, router]);

    if (loading) {
      return <div>Loading...</div>;
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
          router.replace(
            `/login?from=${encodeURIComponent(window.location.pathname)}`
          );
        } else if (user && !allowedRoles.includes(user.role)) {
          router.replace("/unauthorized");
        }
      }
    }, [loading, isAuthenticated, user, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return isAuthenticated && user && allowedRoles.includes(user.role) ? (
      <Component {...props} />
    ) : null;
  };

  return AuthorizedComponent;
};
