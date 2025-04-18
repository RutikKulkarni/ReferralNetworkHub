import Link from "next/link";

import { SignupForm } from "@/components/forms/signup";
import { Icons } from "@/components/icons";

export default function SignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center my-12">
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
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your information to create an account
          </p>
        </div>
        <SignupForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
