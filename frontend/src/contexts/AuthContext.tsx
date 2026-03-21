"use client";

import * as React from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Temporary mock state
  const [user] = React.useState(null);
  const [loading] = React.useState(false);

  const logout = async () => {
    console.log("Mock logout");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    // Return mock for development if context is missing
    return { user: null, loading: false, logout: async () => {} };
  }
  return context;
};
