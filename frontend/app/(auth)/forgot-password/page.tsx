// "use client";
import Link from "next/link";

import { ForgotPasswordForm } from "@/components/forms/forgot-password";
// import { Icons } from "@/components/icons";

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      {/* <div className="absolute left-6 top-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <Icons.arrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
      </div> */}
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
