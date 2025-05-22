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
  validateAccessToken,
  forgotPassword as apiRequestPasswordReset,
  resetPassword as apiResetPassword,
  hasPermission,
} from "@/lib/auth";
import { User, RegisterData } from "@/lib/types";
import { useRouter, usePathname } from "next/navigation";
import LoadingSpinner from "@/components/ui/loading-spinner";

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
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const fromPath = urlParams.get("from");
    if (pathname === "/login" && fromPath) {
      router.push(fromPath);
    }
  }, [pathname, router]);

  // Load user from localStorage if available
  const loadUserFromLocalStorage = useCallback(() => {
    if (typeof window === "undefined") return null;
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      return null;
    }
  }, []);

  // Check if user is logged in based on localStorage
  const checkAuthStatus = useCallback(() => {
    if (typeof window === "undefined") return false;
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    return isLoggedIn && (!!accessToken || !!refreshToken);
  }, []);

  // Add x-access-token header to all fetch requests
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      const accessToken = localStorage.getItem("accessToken");
      const headers = {
        ...options.headers,
        ...(accessToken ? { "x-access-token": accessToken } : {}),
      };
      return originalFetch(url, { ...options, headers });
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Only attempt initialization once if not logged in
    if (initializationAttempted && !checkAuthStatus()) {
      return;
    }

    const initAuth = async () => {
      const isLoggedIn = checkAuthStatus();

      // Skip initialization if clearly not logged in
      if (!isLoggedIn) {
        if (isMounted) {
          setLoading(false);
          setInitializationAttempted(true);
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

        // Validate current session with access token
        try {
          const accessToken = localStorage.getItem("accessToken");
          if (accessToken) {
            const validatedUser = await validateAccessToken(accessToken);
            if (isMounted) {
              setUser(validatedUser);
              localStorage.setItem("user", JSON.stringify(validatedUser));
              handleRedirectAfterAuth();
            }
          } else {
            throw new Error("No access token found");
          }
        } catch (apiErr) {
          console.error("Token validation failed:", apiErr);

          const accessToken = localStorage.getItem("accessToken");
          const refreshToken = localStorage.getItem("refreshToken");
          const isUnauthorized = (apiErr as any)?.response?.status === 401;

          if ((!accessToken && !refreshToken) || isUnauthorized) {
            if (isMounted) {
              setUser(null);
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("user");
            }
          } else if (storedUser) {
            console.log("Using stored user data due to API error");
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (isMounted) {
          const hasTokens = !!(
            localStorage.getItem("accessToken") ||
            localStorage.getItem("refreshToken")
          );

          if (hasTokens && loadUserFromLocalStorage()) {
          } else {
            setUser(null);
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
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
    checkAuthStatus,
  ]);

  // Periodic token validation
  useEffect(() => {
    // Only set up validation interval if user is logged in
    if (!user) return;

    // Re-validate auth every 10 minutes
    const validationInterval = setInterval(async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          const validatedUser = await validateAccessToken(accessToken);
          setUser(validatedUser);
          localStorage.setItem("user", JSON.stringify(validatedUser));
        }
      } catch (err) {
        console.log("Session validation failed", err);
        // Only clear state if there's a 401 (token invalid)
        if ((err as any)?.response?.status === 401) {
          setUser(null);
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(validationInterval);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: userData } = await loginUser(email, password);
      setUser(userData);
      handleRedirectAfterAuth();
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
      const { user: newUser } = await registerUser(userData);
      setUser(newUser);
      handleRedirectAfterAuth();
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
      } catch (err: any) {
        setError(err.message || "Logout failed");
      } finally {
        setUser(null);
        setLoading(false);
        router.push(redirectPath);
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
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      // Wait for auth to be fully initialized before redirecting
      if (!loading && !isAuthenticated) {
        router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      }
    }, [loading, isAuthenticated, router, pathname]);

    if (loading) {
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }

    return isAuthenticated ? <Component {...props} /> : null;
  };

  return AuthenticatedComponent;
};

// Role-based authorization HOC
export const withRole = (
  Component: React.ComponentType<any>,
  allowedRoles: string[]
) => {
  const AuthorizedComponent = (props: any) => {
    const { loading, isAuthenticated, checkPermission } = useAuth();
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
      return (
        <div>
          <LoadingSpinner />
        </div>
      );
    }

    return isAuthenticated && hasAccess ? <Component {...props} /> : null;
  };

  return AuthorizedComponent;
};
