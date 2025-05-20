"use client";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/reset-password";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function ResetPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute left-4 top-6">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Suspense
          fallback={
            <div>
              <LoadingSpinner />
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
