"use client";

import Link from "next/link";
import { Suspense } from "react";
import toast from "react-hot-toast";
import { LoginForm } from "@/features/auth";
import type { LoginCredentials } from "@/features/auth";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/button/theme-toggle";

function LoginContent() {
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      // TODO: Replace with actual API call
      console.log("Login attempt:", { ...credentials, password: "***" });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Login successful!");
      // TODO: Redirect after successful login
      // window.location.href = "/profile";
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
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
      <p className="px-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign up
        </Link>
      </p>
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
