"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { FormProvider } from "@/contexts/UserFormContext";
import UserProfile from "@/components/forms/profile/user-profile";
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
        {user.role === "recruiter" ? <RecruiterProfileForm /> : <UserProfile />}
      </main>
    </FormProvider>
  );
}

// import UserProfile from "@/components/forms/profile/user-profile";

// export default function ProfileEditPage() {
//   return (
//     <div className="container mx-auto py-8 px-4 md:px-6">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold tracking-tight">
//           Complete Your Profile
//         </h1>
//         <p className="text-muted-foreground mt-2">
//           Please complete your profile to continue using the application.
//         </p>
//       </div>
//       <UserProfile />
//     </div>
//   );
// }
