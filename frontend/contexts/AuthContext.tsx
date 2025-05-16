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
  hasPermission,
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
  checkPermission: (requiredRoles: string[]) => boolean;
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
  checkPermission: () => false,
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
        expires: 7, // Set an expiration to match refresh token
      });
    } else {
      Cookies.remove("auth_status");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    }
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initializationAttempted, setInitializationAttempted] =
    useState<boolean>(false);
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

  // Load user from localStorage if available
  const loadUserFromLocalStorage = useCallback(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          console.error("Failed to parse user from localStorage:", e);
          return null;
        }
      }
    }
    return null;
  }, []);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    // Check auth status
    const isLoggedIn =
      typeof window !== "undefined" &&
      (localStorage.getItem("isLoggedIn") === "true" ||
        Cookies.get("auth_status") === "authenticated");

    // Only attempt initialization once
    if (initializationAttempted && !isLoggedIn) {
      return;
    }

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

        // Load user from localStorage first for immediate UI rendering
        const storedUser = loadUserFromLocalStorage();
        if (storedUser && isMounted) {
          setUser(storedUser);
        }

        // Then validate with the API
        const userData = await getCurrentUser();
        if (isMounted) {
          setUser(userData);
          setAuthCookies(true);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(userData));
          handleRedirectAfterAuth();
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (isMounted) {
          // Check if we have access to tokens
          const hasTokens =
            typeof window !== "undefined" &&
            (!!Cookies.get("accessToken") || !!Cookies.get("refreshToken"));

          // If we have tokens but API call failed, keep stored user
          // This handles temporary API failures
          if (hasTokens && loadUserFromLocalStorage()) {
            setAuthCookies(true);
          } else {
            // Clear everything if we don't have tokens or user
            setUser(null);
            setAuthCookies(false);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitializationAttempted(true);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [
    handleRedirectAfterAuth,
    loadUserFromLocalStorage,
    initializationAttempted,
  ]);

  // Check token status periodically
  useEffect(() => {
    // Only set up refresh interval if user is logged in
    if (!user) return;

    // Re-validate auth every 10 minutes
    const refreshInterval = setInterval(async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (err) {
        console.log("Session validation failed", err);
        // Only clear state if there's a 401 (token invalid)
        if ((err as any)?.response?.status === 401) {
          setUser(null);
          setAuthCookies(false);
        }
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(refreshInterval);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await loginUser(email, password);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
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
      localStorage.setItem("user", JSON.stringify(newUser));
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

  const checkPermission = (requiredRoles: string[]): boolean => {
    return hasPermission(user, requiredRoles);
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
        checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const withAuth = (Component: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      // Wait for auth to be fully initialized before redirecting
      if (!loading && !isAuthenticated) {
        router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      }
    }, [loading, isAuthenticated, router, pathname]);

    // Show loading state while auth is initializing
    if (loading) {
      return <div>Loading...</div>;
    }

    // If user data is loaded and authenticated, render the component
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
    const { user, loading, isAuthenticated, checkPermission } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const hasAccess = checkPermission(allowedRoles);

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.replace(`/login?from=${encodeURIComponent(pathname)}`);
        } else if (!hasAccess) {
          router.replace("/unauthorized");
        }
      }
    }, [loading, isAuthenticated, hasAccess, router, pathname]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return isAuthenticated && hasAccess ? <Component {...props} /> : null;
  };

  return AuthorizedComponent;
};
