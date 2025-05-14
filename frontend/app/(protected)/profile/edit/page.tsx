"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FormProvider } from "@/contexts/UserFormContext";
import { UserProfileForm } from "@/components/forms/profile/user/userProfile";
import { RecruiterProfileForm } from "@/components/forms/profile/recruiter/recruiterProfile";
import { toast } from "react-hot-toast";

export default function ProfileEdit() {
  const { user, loading, error } = useAuth();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (!loading && !user) {
      toast.error("Please log in to access your profile.");
    }
  }, [error, loading, user]);

  if (loading) {
    return (
      <main className="container py-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container py-8">
        <div className="text-center text-destructive">
          Please log in to access your profile.
        </div>
      </main>
    );
  }

  return (
    <FormProvider>
      <main className="container py-16">
        {user.role === "recruiter" ? (
          <RecruiterProfileForm />
        ) : (
          <UserProfileForm />
        )}
      </main>
    </FormProvider>
  );
}
