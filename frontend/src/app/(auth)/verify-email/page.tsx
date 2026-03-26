"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import toast from "react-hot-toast";
import api from "@/lib/axios";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [email, setEmail] = React.useState("");
  const [token, setToken] = React.useState(tokenFromUrl || "");
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  const handleVerify = React.useCallback(async () => {
    if (!token) {
      toast.error("Please enter your verification code");
      return;
    }

    setIsVerifying(true);
    try {
      const { data } = await api.post("/auth/verify-email", { token });

      if (data.success) {
        toast.success(data.message || "Email verified successfully!");

        // Wait a moment then redirect to login
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 1500);
      }
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      const errorMsg =
        err.response?.data?.error || "Verification failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsVerifying(false);
    }
  }, [token, router]);

  // Auto-verify if token in URL
  React.useEffect(() => {
    if (tokenFromUrl) {
      handleVerify();
    }
  }, [tokenFromUrl, handleVerify]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsResending(true);
    try {
      await api.post("/auth/resend-verification", { email });
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(
        err.response?.data?.error ||
          "Failed to resend email. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Button
        variant="ghost"
        onClick={() => router.push("/login")}
        className="absolute left-4 top-6 flex items-center text-sm"
      >
        <Icons.arrowLeft className="mr-2 h-4 w-4" />
        Back to Login
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Icons.mailCheck className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center">
            Enter the verification code from your email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Verification Token Input */}
          <div className="space-y-2">
            <Label htmlFor="token">Verification Code</Label>
            <Input
              id="token"
              type="text"
              placeholder="Enter verification code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isVerifying}
            />
          </div>

          <Button
            onClick={handleVerify}
            disabled={!token || isVerifying}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or resend email
              </span>
            </div>
          </div>

          {/* Resend Email Section */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isResending}
            />
          </div>

          <Button
            onClick={handleResendEmail}
            disabled={!email || isResending}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Icons.mail className="mr-2 h-4 w-4" />
                Resend verification email
              </>
            )}
          </Button>

          <div className="pt-2 text-center text-sm text-muted-foreground">
            <p>Check your spam folder if you don&apos;t see the email</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailContent />
    </React.Suspense>
  );
}
