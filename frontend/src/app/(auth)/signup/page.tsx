"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SignupForm } from "@/features/auth";
import type { SignupData } from "@/features/auth";
import { useAuth } from "@/contexts/AuthContext";
import { UserType } from "@/types/auth.types";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/button/theme-toggle";

function SignupContent() {
  const { register } = useAuth();
  const router = useRouter();

  const handleSignup = async (data: SignupData) => {
    try {
      // Call register with proper type conversion
      // Default to JOB_SEEKER for public registration
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        userType: UserType.JOB_SEEKER, // Default user type for public signup
      });

      toast.success("Account created successfully!");
      router.push("/dashboard"); // Redirect to dashboard after signup
    } catch (error) {
      const err = error as { message?: string };
      console.error("Signup failed:", error);
      
      // Show error with line breaks for better readability
      const errorMessage = err.message || "Signup failed. Please try again.";
      
      // If error has multiple lines (from backend errors array), show each on new line
      if (errorMessage.includes('\n')) {
        const errors = errorMessage.split('\n');
        errors.forEach((errMsg, index) => {
          setTimeout(() => {
            toast.error(errMsg, { duration: 5000 });
          }, index * 100); // Stagger toasts slightly
        });
      } else {
        toast.error(errorMessage, { duration: 5000 });
      }
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
