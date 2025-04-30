"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Icons } from "@/components/icons";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  // Render children only if user is logged in
  if (user) {
    return (
      <div className="relative flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    );
  }

  // Return null if redirecting (handled by useEffect)
  return null;
}
