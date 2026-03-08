"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EducationStep from "@/components/forms/profile/user/education-step";
// import PersonalInfoStep from "@/components/forms/profile/user/personal-info-step";
// import { ProfessionalForm } from "@/components/forms/profile/user/professional-info-step";
// import SkillsStep from "@/components/forms/profile/user/skills-step";
// import PreferencesStep from "@/components/forms/profile/user/preferences-step";
import { FormSkeleton } from "@/components/forms/profile/skeleton";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { useFormState, FormProvider } from "@/contexts/UserFormContext";
import { Progress } from "@/components/ui/progress";
import * as z from "zod";

const STEPS = [
  "personal",
  "professional",
  "education",
  "skills",
  "preferences",
] as const;

const personalInfoSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    location: z.string().min(2),
    phone: z.string().regex(/^\+?[\d\s-]{8,}$/),
    gender: z.enum(["male", "female", "other"]),
    genderOther: z.string().optional(),
  })
  .refine(
    (data) =>
      data.gender !== "other" ||
      (data.gender === "other" &&
        data.genderOther &&
        data.genderOther.length > 0),
    {
      message: "Please specify gender when selecting 'Other'",
      path: ["genderOther"],
    }
  );

export function RecruiterProfileForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] =
    useState<(typeof STEPS)[number]>("personal");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { formData } = useFormState();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const validateSection = (section: (typeof STEPS)[number]) => {
    try {
      switch (section) {
        case "personal":
          personalInfoSchema.parse(formData.basic);
          return true;
        // Add validation for other sections as needed
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleTabChange = (value: (typeof STEPS)[number]) => {
    const currentIndex = STEPS.indexOf(activeTab);
    const targetIndex = STEPS.indexOf(value);

    if (targetIndex > currentIndex && !validateSection(activeTab)) {
      toast.error("Please complete all required fields before proceeding.");
      return;
    }

    setActiveTab(value);
    setProgress(((targetIndex + 1) / STEPS.length) * 100);
  };

  const handleNext = () => {
    const currentIndex = STEPS.indexOf(activeTab);
    if (currentIndex < STEPS.length - 1) {
      if (!validateSection(activeTab)) {
        toast.error("Please complete all required fields before proceeding.");
        return;
      }
      const nextTab = STEPS[currentIndex + 1];
      setActiveTab(nextTab);
      setProgress(((currentIndex + 2) / STEPS.length) * 100);
    }
  };

  const handlePrevious = () => {
    const currentIndex = STEPS.indexOf(activeTab);
    if (currentIndex > 0) {
      const prevTab = STEPS[currentIndex - 1];
      setActiveTab(prevTab);
      setProgress((currentIndex / STEPS.length) * 100);
    }
  };

  const handleSubmit = async () => {
    if (!validateSection(activeTab)) {
      toast.error("Please complete all required fields before submitting.");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      document.cookie = "profileComplete=true; path=/";
      toast.success("Profile completed successfully!");
      router.push("/profile");
    } catch (error) {
      toast.error("Failed to save profile.");
    }
  };

  if (loading) return <FormSkeleton />;

  return (
    <FormProvider>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">
            Build Your Professional Profile
          </h1>
          <p className="text-muted-foreground">
            Complete each section to create your professional profile. Your
            progress is saved automatically.
          </p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2 bg-muted" />
          <p className="text-sm text-muted-foreground text-right">
            {Math.round(progress)}% Complete
          </p>
        </div>

        <Tabs
          value={activeTab}
          //   onValueChange={handleTabChange}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-5 bg-muted rounded-lg p-1">
            {STEPS.map((step) => (
              <TabsTrigger
                key={step}
                value={step}
                className="capitalize text-sm font-medium data-[state=active]:bg-background data-[state=active]:text-foreground"
              >
                {step}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="education" className="mt-0">
            <EducationStep />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={activeTab === "personal"}
            className="min-w-[120px]"
          >
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          {activeTab === "preferences" ? (
            <Button onClick={handleSubmit} className="min-w-[120px]">
              <Icons.check className="mr-2 h-4 w-4" />
              Complete Profile
            </Button>
          ) : (
            <Button onClick={handleNext} className="min-w-[120px]">
              Next
              <Icons.arrowRight className="ml PMID: 2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </FormProvider>
  );
}
