"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { LoginForm } from "@/features/auth";
import type { LoginCredentials } from "@/features/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/button/theme-toggle";

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user arrived from email verification
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully! You can now login.", {
        duration: 5000,
        icon: "✅",
      });
    }
  }, [searchParams]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      toast.success("Login successful!");
      router.push("/dashboard"); // Redirect to dashboard after login
    } catch (error) {
      const err = error as { message?: string };
      console.error("Login failed:", error);

      // Get backend error message
      const errorMessage = err.message || "Login failed. Please try again.";

      // Special handling for email verification errors
      if (
        errorMessage.includes("Email verification required") ||
        errorMessage.includes("verify your email") ||
        errorMessage.includes("verify your account")
      ) {
        toast.error(
          (t) => (
            <div className="flex flex-col gap-2">
              <p className="font-medium text-sm">{errorMessage}</p>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  router.push("/verify-email");
                }}
                className="mt-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Verify Email Now →
              </button>
            </div>
          ),
          {
            duration: 8000,
            icon: "📧",
          },
        );
        return;
      }

      // For blocked/inactive account errors
      if (
        errorMessage.includes("blocked") ||
        errorMessage.includes("inactive") ||
        errorMessage.includes("contact support")
      ) {
        toast.error(errorMessage, {
          duration: 8000,
          icon: "🚫",
        });
        return;
      }

      // If error has multiple lines (from backend errors array), show each on new line
      if (errorMessage.includes("\n")) {
        const errors = errorMessage.split("\n");
        errors.forEach((errMsg, index) => {
          setTimeout(() => {
            toast.error(errMsg, { duration: 5000 });
          }, index * 100); // Stagger toasts slightly
        });
      } else {
        // Show backend error message as-is
        toast.error(errorMessage, { duration: 5000 });
      }
    }
  };

  const handleSocialLogin = (provider: "github" | "linkedin") => {
    // TODO: Implement OAuth flow for social login
    console.log(`Social login with ${provider}`);
    toast(
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`,
      { icon: "🔜" },
    );
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to sign in to your account
        </p>
      </div>
      <LoginForm onSubmit={handleLogin} onSocialLogin={handleSocialLogin} />
      <div className="space-y-2">
        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </p>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Need to verify your email?{" "}
          <Link
            href="/verify-email"
            className="underline underline-offset-4 hover:text-primary"
          >
            Verify now
          </Link>
        </p>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute left-4 top-6">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center text-sm text-muted-foreground hover:text-primary cursor-pointer"
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="absolute right-4 top-6">
        <ModeToggle />
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
