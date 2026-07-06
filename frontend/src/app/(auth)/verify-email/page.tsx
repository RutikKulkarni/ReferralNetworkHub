"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ModeToggle } from "@/components/button/theme-toggle";
import { FormField } from "@/shared/components/forms/molecules";
import { BaseInput } from "@/shared/components/forms/atoms";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

const codeSchema = z.object({
  code: z
    .string()
    .min(1, "Verification code is required")
    .min(6, "Code must be at least 6 characters"),
});

type CodeFormData = z.infer<typeof codeSchema>;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [step, setStep] = React.useState<"email" | "code" | "success">(
    tokenFromUrl ? "code" : "email",
  );
  const [email, setEmail] = React.useState("");
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const [isResending, setIsResending] = React.useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: tokenFromUrl || "" },
  });

  // Cooldown timer
  React.useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendEmail = async (data: EmailFormData) => {
    setEmail(data.email);
    try {
      await api.post("/auth/resend-verification", { email: data.email });
      toast.success("Verification code sent! Check your inbox.");
      setStep("code");
      setResendCooldown(60);
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(
        err.response?.data?.error || "Failed to send code. Please try again.",
      );
    }
  };

  const handleVerifyCode = async (data: CodeFormData) => {
    try {
      const { data: result } = await api.post("/auth/verify-email", {
        token: data.code,
      });

      if (result.success) {
        setStep("success");
        toast.success("Email verified successfully!");
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 2000);
      }
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(
        err.response?.data?.error || "Invalid code. Please try again.",
      );
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await api.post("/auth/resend-verification", { email });
      toast.success("New code sent! Check your inbox.");
      setResendCooldown(60);
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(
        err.response?.data?.error || "Failed to resend. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  // Auto-verify if token in URL
  React.useEffect(() => {
    if (!tokenFromUrl) return;

    let cancelled = false;
    const verify = async () => {
      try {
        const { data: result } = await api.post("/auth/verify-email", {
          token: tokenFromUrl,
        });
        if (!cancelled && result.success) {
          setStep("success");
          toast.success("Email verified successfully!");
          setTimeout(() => {
            router.push("/login?verified=true");
          }, 2000);
        }
      } catch (error) {
        if (!cancelled) {
          const err = error as { response?: { data?: { error?: string } } };
          toast.error(
            err.response?.data?.error || "Invalid code. Please try again.",
          );
        }
      }
    };
    verify();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenFromUrl]);

  // Step 3: Success
  if (step === "success") {
    return (
      <>
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <Icons.check className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Email Verified!
          </h1>
          <p className="text-sm text-muted-foreground">
            Your email has been verified. Redirecting to login...
          </p>
        </div>
      </>
    );
  }

  // Step 2: Enter code
  if (step === "code") {
    return (
      <>
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icons.mailCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-sm text-muted-foreground">
            We sent a verification code to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="grid gap-6">
          <form
            onSubmit={codeForm.handleSubmit(handleVerifyCode)}
            className="space-y-4"
          >
            <FormField
              label="Verification Code"
              error={codeForm.formState.errors.code?.message}
              required
            >
              <BaseInput
                {...codeForm.register("code")}
                type="text"
                placeholder="Enter the code from your email"
                error={!!codeForm.formState.errors.code}
                disabled={codeForm.formState.isSubmitting}
              />
            </FormField>

            <Button
              type="submit"
              className="w-full"
              disabled={codeForm.formState.isSubmitting}
            >
              {codeForm.formState.isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Didn&apos;t receive the code?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icons.refresh
                className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`}
              />
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend"}
            </button>
          </div>

          <p className="px-8 text-center text-xs text-muted-foreground">
            Check your spam folder if you don&apos;t see the email
          </p>
        </div>
      </>
    );
  }

  // Step 1: Enter email
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Icons.mailCheck className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Verify your email
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we&apos;ll send you a verification code
        </p>
      </div>

      <div className="grid gap-6">
        <form
          onSubmit={emailForm.handleSubmit(handleSendEmail)}
          className="space-y-4"
        >
          <FormField
            label="Email"
            error={emailForm.formState.errors.email?.message}
            required
          >
            <BaseInput
              {...emailForm.register("email")}
              type="email"
              placeholder="name@gmail.com"
              error={!!emailForm.formState.errors.email}
              disabled={emailForm.formState.isSubmitting}
            />
          </FormField>

          <Button
            type="submit"
            className="w-full"
            disabled={emailForm.formState.isSubmitting}
          >
            {emailForm.formState.isSubmitting ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </form>

        <p className="px-8 text-center text-sm text-muted-foreground">
          Already verified?{" "}
          <a
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </a>
        </p>
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
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
        <React.Suspense
          fallback={<div className="text-center">Loading...</div>}
        >
          <VerifyEmailContent />
        </React.Suspense>
      </div>
    </div>
  );
}
