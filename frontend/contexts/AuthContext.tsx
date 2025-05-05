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
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

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

// Set auth cookies that can be read by middleware
const setAuthCookies = (isAuthenticated: boolean) => {
  if (typeof window !== "undefined") {
    if (isAuthenticated) {
      // Set auth status cookie (accessible by middleware)
      Cookies.set("auth_status", "authenticated", {
        path: "/",
        secure: window.location.protocol === "https:",
        sameSite: "strict",
      });

      // Also set localStorage for client-side checks
      localStorage.setItem("isLoggedIn", "true");
    } else {
      Cookies.remove("auth_status");
      localStorage.removeItem("isLoggedIn");
    }
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Handle redirection after login
  const handleRedirectAfterAuth = useCallback(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const fromPath = urlParams.get("from");
      if (pathname === "/login" && fromPath) {
        setTimeout(() => {
          router.push(fromPath);
        }, 100);
      }
    }
  }, [pathname, router]);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    // Check localStorage first to avoid unnecessary API calls
    const isLoggedIn =
      typeof window !== "undefined" &&
      (localStorage.getItem("isLoggedIn") === "true" ||
        Cookies.get("auth_status") === "authenticated");

    const initAuth = async () => {
      // Skip initialization if clearly not logged in
      if (!isLoggedIn) {
        if (isMounted) {
          setLoading(false);
          setAuthCookies(false);
        }
        return;
      }

      try {
        setLoading(true);
        const userData = await getCurrentUser();
        if (isMounted) {
          setUser(userData);
          setAuthCookies(true);
          handleRedirectAfterAuth();
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          setAuthCookies(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [handleRedirectAfterAuth]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await loginUser(email, password);
      setUser(userData);
      setAuthCookies(true);
      handleRedirectAfterAuth();
    } catch (err: any) {
      setError(err.message || "Login failed");
      setAuthCookies(false);
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
      setAuthCookies(true);
      handleRedirectAfterAuth();
    } catch (err: any) {
      setError(err.message || "Registration failed");
      setAuthCookies(false);
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
        setAuthCookies(false);
        router.push(redirectPath);
      } catch (err: any) {
        setError(err.message || "Logout failed");
        setUser(null);
        setAuthCookies(false);
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
    const pathname = usePathname();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      }
    }, [loading, isAuthenticated, router, pathname]);

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
    const pathname = usePathname();

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.replace(`/login?from=${encodeURIComponent(pathname)}`);
        } else if (user && !allowedRoles.includes(user.role)) {
          router.replace("/unauthorized");
        }
      }
    }, [loading, isAuthenticated, user, router, pathname]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return isAuthenticated && user && allowedRoles.includes(user.role) ? (
      <Component {...props} />
    ) : null;
  };

  return AuthorizedComponent;
};
