"use client";

import toast from "react-hot-toast";
import { ForgotPasswordForm } from "@/features/auth";
import type { ForgotPasswordData } from "@/features/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/button/theme-toggle";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const handleForgotPassword = async (data: ForgotPasswordData) => {
    try {
      await forgotPassword(data.email);
      toast.success("Reset link sent! Check your email.");
    } catch (error) {
      const err = error as { message?: string };
      console.error("Forgot password failed:", error);
      toast.error(err.message || "Failed to send reset link. Please try again.");
    }
  };

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
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot your password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we&apos;ll send you a link to reset
            your password
          </p>
        </div>
        <ForgotPasswordForm onSubmit={handleForgotPassword} />
      </div>
    </div>
  );
}
