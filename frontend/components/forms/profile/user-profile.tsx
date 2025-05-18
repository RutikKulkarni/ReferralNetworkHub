"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validations/profile-validations";
import PersonalInfoStep from "@/components/forms/profile/user/personal-info-step";
import { ProfessionalForm } from "@/components/forms/profile/user/professional-info-step";
import EducationStep from "@/components/forms/profile/user/education-step";
import SkillsStep from "@/components/forms/profile/user/skills-step";
import PreferencesStep from "@/components/forms/profile/user/preferences-step";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { personalDomains } from "@/lib/validations/auth-validations";
import { ProfileFormValues, stepValidationFields } from "@/lib/types";

const steps = [
  { id: "personal", label: "Personal Information" },
  { id: "professional", label: "Professional Information" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills & Expertise" },
  { id: "preferences", label: "Preferences" },
];

export default function UserProfile() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<ProfileFormValues>>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("profileFormData");
      return savedData ? JSON.parse(savedData) : {};
    }
    return {};
  });

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: formData,
    mode: "onChange",
  });

  const { handleSubmit, trigger, formState, watch, setValue, getFieldState } =
    methods;
  const watchAllFields = watch();

  // Save form data to local storage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("profileFormData", JSON.stringify(watchAllFields));
    }
  }, [watchAllFields]);

  // Check user role from local storage
  const [userRole, setUserRole] = useState("user");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserRole(userData.role || "user");

          // Apply email validation based on user role
          const currentEmail = watch("email");
          if (currentEmail) {
            const emailParts = currentEmail.split("@");
            if (emailParts.length === 2) {
              const domain = emailParts[1].toLowerCase();
              const isPersonalEmail = personalDomains.includes(domain);

              if (userData.role === "user" && !isPersonalEmail) {
                setValue("email", "");
                toast.error(
                  "Users must use a personal email address (e.g., Gmail, Yahoo)"
                );
              } else if (userData.role === "recruiter" && isPersonalEmail) {
                setValue("email", "");
                toast.error("Recruiters must use a company email address");
              }
            }
          }
        } catch (e) {
          console.error("Error parsing user data:", e);
          toast.error("Error loading user data");
        }
      }
    }
  }, []);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      // API call would go here
      console.log("Submitting data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Profile updated successfully!");
      localStorage.removeItem("profileFormData"); // Clear form data after successful submission
      router.push("/dashboard"); // Redirect to dashboard after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    const fieldsToValidate =
      stepValidationFields[
        steps[currentStep].id as keyof typeof stepValidationFields
      ];
    const isValid = await trigger(fieldsToValidate as any, {
      shouldFocus: true,
    });

    if (isValid) {
      toast.success(`${steps[currentStep].label} completed!`);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      // Collect and display specific error messages
      const errorMessages = fieldsToValidate
        .map((field) => {
          const fieldState = getFieldState(field as keyof ProfileFormValues);
          return fieldState.error?.message;
        })
        .filter((message) => message)
        .join(", ");
      toast.error(
        errorMessages ||
          "Please fill in all required fields correctly before proceeding."
      );
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep userRole={userRole} />;
      case 1:
        return <ProfessionalForm />;
      case 2:
        return <EducationStep />;
      case 3:
        return <SkillsStep />;
      case 4:
        return <PreferencesStep />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          <Card className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">
                  Step {currentStep + 1}: {steps[currentStep].label}
                </h2>
                <div className="flex items-center gap-2">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`w-3 h-3 rounded-full ${
                        index < currentStep
                          ? "bg-green-500"
                          : index === currentStep
                          ? "bg-primary"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {renderStepContent()}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !formState.isValid}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? "Saving..." : "Save Profile"}
                  {isSubmitting ? null : <Save className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </form>
    </FormProvider>
  );
}
