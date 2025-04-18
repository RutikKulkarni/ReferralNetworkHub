"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/auth";

interface User {
  id: string;
  email: string;
  role: "user" | "recruiter" | "admin";
  firstName: string;
  lastName: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signup: (
    fullName: string,
    email: string,
    password: string,
    role: "user" | "recruiter",
    companyName?: string
  ) => Promise<any>;
  login: (
    email: string,
    password: string,
    role: "user" | "recruiter"
  ) => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const signup = async (
    fullName: string,
    email: string,
    password: string,
    role: "user" | "recruiter",
    companyName?: string
  ) => {
    try {
      const [firstName, ...lastNameParts] = fullName.split(" ");
      const lastName = lastNameParts.join(" ");
      const { data } = await api.post("/register", {
        firstName,
        lastName,
        email,
        password,
        role,
        companyName: role === "recruiter" ? companyName : undefined,
      });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  const login = async (
    email: string,
    password: string,
    role: "user" | "recruiter"
  ) => {
    try {
      const { data } = await api.post("/login", { email, password, role });

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/logout", { refreshToken });
      }
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setUser(null);
      router.push("/login");
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Logout failed");
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { data } = await api.post("/forgot-password", { email });
      return data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to send reset email"
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signup, login, logout, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
