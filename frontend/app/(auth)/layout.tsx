"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not loading and user is logged in
    if (!isLoading && user) {
      router.replace("/profile");
    }
  }, [user, isLoading, router]);

  // Render nothing or a loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render children only if user is not logged in
  if (!user) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  // Return null if redirecting (handled by useEffect)
  return null;
}
