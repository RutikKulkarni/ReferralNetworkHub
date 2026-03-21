"use client";

import Link from "next/link";
import { Suspense } from "react";
import toast from "react-hot-toast";
import { SignupForm } from "@/features/auth";
import type { SignupData } from "@/features/auth";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/button/theme-toggle";

function SignupContent() {
  const handleSignup = async (data: SignupData) => {
    try {
      // TODO: Replace with actual API call
      console.log("Signup attempt:", {
        ...data,
        password: "***",
        confirmPassword: "***",
      });
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(
        `Account created successfully for ${data.firstName} ${data.lastName}!`,
      );
      // TODO: Redirect after successful signup
      // window.location.href = "/login";
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleSocialSignup = (provider: "github" | "linkedin") => {
    // TODO: Implement OAuth flow for social signup
    console.log(`Social signup with ${provider}`);
    toast(
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} signup coming soon!`,
      { icon: "🔜" },
    );
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your information to create an account
        </p>
      </div>
      <SignupForm onSubmit={handleSignup} onSocialSignup={handleSocialSignup} />
      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Log in
        </Link>
      </p>
    </>
  );
}

export default function SignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center my-12">
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
          <SignupContent />
        </Suspense>
      </div>
    </div>
  );
}
