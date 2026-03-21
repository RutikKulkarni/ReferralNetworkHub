"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth";
import type { LoginCredentials } from "@/features/auth";

/**
 * Login Page
 *
 * Provides user authentication interface
 */
export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Login attempt:", {
        ...credentials,
        password: "***",
      });

      // TODO: Handle successful login
      // - Store auth token
      // - Redirect to dashboard
      // For now, just show success message
      alert("Login successful! Redirecting to dashboard...");

      // Redirect to home or dashboard
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleSignupClick = () => {
    router.push("/signup");
  };

  const handleForgotPasswordClick = () => {
    // TODO: Implement forgot password flow
    alert("Forgot password feature coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <LoginForm
          onSubmit={handleLogin}
          showSignupLink={true}
          onSignupClick={handleSignupClick}
          showForgotPassword={true}
          onForgotPasswordClick={handleForgotPasswordClick}
        />
      </div>
    </div>
  );
}
