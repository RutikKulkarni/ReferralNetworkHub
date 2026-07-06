"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Icons } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
    </div>
  );
}
