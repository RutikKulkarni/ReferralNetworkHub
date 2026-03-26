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
import { Icons } from "@/components/icons";
import toast from "react-hot-toast";
import api from "@/lib/axios";

function VerifyEmailPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [isResending, setIsResending] = React.useState(false);
  const [resendCooldown, setResendCooldown] = React.useState(0);

  // Cooldown timer
  React.useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000,
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!email) {
      toast.error("Email address not found. Please register again.");
      return;
    }

    setIsResending(true);
    try {
      await api.post("/auth/resend-verification", { email });
      toast.success("Verification email sent! Please check your inbox.");
      setResendCooldown(60); // 60 second cooldown
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
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Icons.mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to
            {email && (
              <span className="block mt-2 font-medium text-foreground">
                {email}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <Icons.check className="mr-2 inline h-4 w-4 text-primary" />
              Click the link in the email to verify your account
            </p>
            <p>
              <Icons.check className="mr-2 inline h-4 w-4 text-primary" />
              The link will expire in 24 hours
            </p>
            <p>
              <Icons.check className="mr-2 inline h-4 w-4 text-primary" />
              Check your spam folder if you don&apos;t see it
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <p className="text-sm text-muted-foreground text-center">
              Didn&apos;t receive the email?
            </p>
            <Button
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0}
              variant="outline"
              className="w-full"
            >
              {isResending ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                "Resend verification email"
              )}
            </Button>
          </div>

          <div className="pt-4 text-center">
            <Button
              variant="link"
              onClick={() => router.push("/verify-email")}
              className="text-sm"
            >
              Already verified? Enter code manually
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPendingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <VerifyEmailPendingContent />
    </React.Suspense>
  );
}
