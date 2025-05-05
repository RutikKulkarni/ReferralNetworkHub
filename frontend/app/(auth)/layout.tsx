"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/loading-spinner";

// Client Component for redirect logic
function AuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && user) {
      const from = searchParams.get("from") || "/profile";
      router.replace(decodeURIComponent(from));
    }
  }, [user, loading, router, searchParams]);

  return null;
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  // Wrap client-side redirect logic in Suspense
  return (
    <Suspense fallback={null}>
      <AuthRedirect />
    </Suspense>
  );
}
