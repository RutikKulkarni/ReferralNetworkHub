"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { Icons } from "@/components/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormState } from "@/contexts/UserFormContext";
import { ImageCropper } from "@/components/forms/profile/image-cropper";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const basicInfoSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long"),
    email: z.string().email("Please enter a valid email address"),
    location: z
      .string()
      .min(2, "Location must be at least 2 characters")
      .max(100, "Location is too long"),
    phone: z
      .string()
      .regex(/^\+?[\d\s-]{8,}$/, "Please enter a valid phone number"),
    gender: z.enum(["male", "female", "other"], {
      message: "Please select a gender",
    }),
    genderOther: z.string().optional(),
    linkedin: z
      .string()
      .url("Please enter a valid LinkedIn URL")
      .optional()
      .or(z.literal("")),
    github: z
      .string()
      .url("Please enter a valid GitHub URL")
      .optional()
      .or(z.literal("")),
    website: z
      .string()
      .url("Please enter a valid website URL")
      .optional()
      .or(z.literal("")),
    bio: z.string().max(1200, "Bio must be under 200 words").optional(),
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

type BasicInfoValues = z.infer<typeof basicInfoSchema>;

export function PersonalInformationForm() {
  const { formData, updateBasicInfo } = useFormState();
  const [profileImage, setProfileImage] = useState<string | null>(
    formData.basic.profileImage || null
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BasicInfoValues>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      fullName: formData.basic.fullName || "",
      email: formData.basic.email || "",
      location: formData.basic.location || "",
      phone: formData.basic.phone || "",
      gender: formData.basic.gender || "male",
      genderOther: formData.basic.genderOther || "",
      linkedin: formData.basic.linkedin || "",
      github: formData.basic.github || "",
      website: formData.basic.website || "",
      bio: formData.basic.bio || "",
    },
    mode: "onChange",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please upload a JPEG, JPG, PNG, or WebP file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCropImageSrc(e.target?.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = (croppedImageUrl: string) => {
    setProfileImage(croppedImageUrl);
    updateBasicInfo({ profileImage: croppedImageUrl });
    setShowCropper(false);
    toast.success("Profile image updated successfully.");
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    updateBasicInfo({ profileImage: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Profile image removed.");
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_RESUME_TYPES.includes(file.type)) {
      toast.error("Please upload a DOC, DOCX, or PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    setResumeFile(file);
    updateBasicInfo({ resume: file.name });
    toast.success("Resume uploaded successfully.");
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    updateBasicInfo({ resume: null });
    if (resumeInputRef.current) resumeInputRef.current.value = "";
    toast.success("Resume removed.");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!ACCEPTED_RESUME_TYPES.includes(file.type)) {
      toast.error("Please upload a DOC, DOCX, or PDF file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    setResumeFile(file);
    updateBasicInfo({ resume: file.name });
    toast.success("Resume uploaded successfully.");
  };

  const onSubmit = async (data: BasicInfoValues) => {
    try {
      updateBasicInfo(data);
      toast.success("Personal information saved successfully.");
    } catch (error) {
      toast.error("Failed to save personal information.");
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-foreground">
          Personal Information
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Provide your personal details to build your professional profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Image */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="relative flex-shrink-0">
                <div className="h-32 w-32 overflow-hidden rounded-full bg-muted border-2 border-border">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <Icons.userCircle className="h-16 w-16" />
                    </div>
                  )}
                </div>
                {/* <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icons.add className="h-4 w-4" />
                  <span className="sr-only">Upload photo</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    title="Upload profile image"
                  />
                </Button> */}
              </div>
              <div className="flex-1 space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Profile Photo
                </Label>
                <p className="text-sm text-muted-foreground">
                  Upload a professional headshot (max 2MB, square images
                  recommended).
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icons.upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  {profileImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      <Icons.trash className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {showCropper && cropImageSrc && (
              <ImageCropper
                imageSrc={cropImageSrc}
                onCroppedImage={handleCroppedImage}
                onCancel={() => setShowCropper(false)}
              />
            )}

            {/* Basic Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="San Francisco, CA"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      {["male", "female", "other"].map((value) => (
                        <FormItem
                          key={value}
                          className="flex items-center gap-2"
                        >
                          <FormControl>
                            <RadioGroupItem value={value} />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {value}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("gender") === "other" && (
              <FormField
                control={form.control}
                name="genderOther"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify Gender</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Please specify"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Social Links */}
            <div className="grid gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/username"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://github.com/username"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://yourwebsite.com"
                        {...field}
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Resume */}
            <div className="space-y-2">
              <Label>Resume Upload</Label>
              <div
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 transition-colors hover:bg-muted"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {resumeFile ? (
                  <div className="flex w-full items-center justify-between bg-background p-4 rounded-md">
                    <div className="flex items-center gap-3">
                      <Icons.page className="h-6 w-6 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveResume}
                    >
                      <Icons.trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Icons.upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground">
                      Upload your resume
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Supports DOC, DOCX, PDF (max 2MB)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      Browse Files
                      <input
                        ref={resumeInputRef}
                        type="file"
                        className="hidden"
                        accept=".doc,.docx,.pdf"
                        onChange={handleResumeChange}
                        title="Upload resume"
                      />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your career goals and professional background (max 200 words)"
                      rows={5}
                      maxLength={1200}
                      {...field}
                      className="bg-background"
                    />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/1200 characters
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
