"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { emailSchema, passwordSchema } from "@/lib/validations/auth-validations";

const formSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(token, values.email, values.password);
      setIsSuccess(true);
      toast.success("Password has been reset successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto  flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Icons.check className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Password Reset Complete</h2>
        <p className="text-sm text-muted-foreground">
          Your password has been reset successfully.
        </p>
        <Button className="w-full" onClick={() => router.push("/login")}>
          Log in with your new password
        </Button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <Icons.warning className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Invalid Reset Link</h2>
        <p className="text-sm text-muted-foreground">
          The password reset link is invalid or has expired.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/forgot-password")}
        >
          Request a new reset link
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Reset Your Password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your new password to reset your account.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Reset Password
          </Button>
        </form>
      </Form>
      <p className="px-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="underline underline-offset-4 hover:text-primary"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
