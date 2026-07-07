"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ResetPasswordForm } from "@/features/auth";
import type { ResetPasswordData } from "@/features/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/button/theme-toggle";

function ResetPasswordContent() {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Invalid token state
  if (!token || !email) {
    return (
      <div className="grid gap-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <Icons.warning className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Invalid Reset Link</h2>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
        </div>
        <Button
          className="w-full"
          onClick={() => router.push("/forgot-password")}
        >
          Request a new reset link
        </Button>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <a
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Log in
          </a>
        </p>
      </div>
    );
  }

  const handleResetPassword = async (data: ResetPasswordData) => {
    try {
      await resetPassword(token, email, data.newPassword);
      toast.success("Password reset successful!");
    } catch (error) {
      const err = error as { message?: string };
      console.error("Reset password failed:", error);
      toast.error(
        err.message || "Failed to reset password. Please try again.",
      );
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset your password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below
        </p>
      </div>
      <ResetPasswordForm onSubmit={handleResetPassword} />
    </>
  );
}

export default function ResetPasswordPage() {
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
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
