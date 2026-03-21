"use client";

import { useRouter } from "next/navigation";
import { SignupForm } from "@/features/auth";
import type { SignupData } from "@/features/auth";

/**
 * Signup Page
 *
 * Provides user registration interface
 */
export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (data: SignupData) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     firstName: data.firstName,
      //     lastName: data.lastName,
      //     email: data.email,
      //     password: data.password,
      //     subscribeNewsletter: data.subscribeNewsletter,
      //   }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Signup attempt:", {
        ...data,
        password: "***",
        confirmPassword: "***",
      });

      // TODO: Handle successful signup
      // - Store auth token (if auto-login after signup)
      // - Send verification email
      // - Redirect to dashboard or email verification page
      alert(
        `Account created successfully for ${data.firstName} ${data.lastName}! Please check your email to verify your account.`,
      );

      // Redirect to login or dashboard
      router.push("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">
            Join ReferralNetworkHub and start connecting with professionals
          </p>
        </div>

        <SignupForm
          onSubmit={handleSignup}
          showLoginLink={true}
          onLoginClick={handleLoginClick}
        />
      </div>
    </div>
  );
}
