import { z } from "zod";

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "recruiter" | "admin";
  companyName?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "user" | "recruiter" | "admin";
  companyName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export type Internship = {
  title: string;
  company: string;
  startDate: Date | null;
  endDate: Date | null;
  currentlyWorking?: boolean;
  responsibilities?: string;
};

export type Education = {
  degree: string;
  otherDegree?: string;
  institution: string;
  fieldOfStudy: string;
  graduationStatus: "completed" | "pursuing" | "incomplete";
  startDate?: Date | null;
  endDate?: Date | null;
  expectedEndDate?: Date | null;
};

export type UserRole = "user" | "recruiter";

export interface FormValues {
  skills: Skill[];
  certifications: Certification[];
}

export const experienceSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  company: z.string().min(1, { message: "Company name is required" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  current: z.boolean().optional(),
  responsibilities: z.string().optional(),
});

export const experienceEditSchema = experienceSchema.extend({
  id: z.string(),
});

export const professionalSchema = z.object({
  experienceType: z.enum(["experienced", "fresher"]),
  currentTitle: z.string().optional(),
  currentCompany: z.string().optional(),
  industry: z.string().optional(),
  yearsOfExperience: z.string().optional(),
});

export const preferencesSchema = z.object({
  referralAvailability: z.enum(["provide", "receive", "both"]).optional(),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, { message: "You must accept the terms" }),
  preferredLocations: z.array(z.string()).optional(),
  targetCompanies: z.array(z.string()).optional(),
  jobPreferences: z.string().optional(),
});

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  state: z.string().min(1, { message: "State/Province is required" }),
  pincode: z.string().min(1, { message: "Postal/ZIP code is required" }),
  gender: z.enum(["male", "female", "other"], {
    message: "Gender is required",
  }),
  resume: z.any().refine((val) => val !== null, {
    message: "Resume is required",
  }),
  bio: z
    .string()
    .min(1, { message: "Bio is required" })
    .max(200, { message: "Bio must be 200 words or less" }),
  profilePicture: z.string().nullable().optional(),
});

export const educationSchema = z.object({
  highestDegree: z
    .enum([
      "high_school",
      "associate",
      "bachelor",
      "master",
      "doctorate",
      "diploma",
      "certificate",
      "other",
    ])
    .optional(),
  otherDegree: z.string().optional(),
  institution: z.string().min(1, { message: "Institution name is required" }),
  fieldOfStudy: z.string().min(1, { message: "Field of study is required" }),
  graduationStatus: z.enum(["completed", "pursuing", "incomplete"], {
    message: "Graduation status is required",
  }),
  educationStartDate: z.date().optional(),
  educationEndDate: z.date().optional(),
  expectedEndDate: z.date().optional(),
  additionalEducation: z
    .array(
      z.object({
        degree: z.string().min(1, { message: "Degree is required" }),
        otherDegree: z.string().optional(),
        institution: z
          .string()
          .min(1, { message: "Institution name is required" }),
        fieldOfStudy: z
          .string()
          .min(1, { message: "Field of study is required" }),
        graduationStatus: z.enum(["completed", "pursuing", "incomplete"], {
          message: "Graduation status is required",
        }),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        expectedEndDate: z.date().optional(),
      })
    )
    .optional(),
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type EducationValues = z.infer<typeof educationSchema>;

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  countryCode: string;
  address: string;
  state: string;
  pincode: string;
  gender: "male" | "female" | "other";
  bio: string;
  profilePicture?: any;
  resume?: any;
  experienceLevel: "experienced" | "fresher";
  currentJobTitle?: string;
  currentCompany?: string;
  industry?: string;
  otherIndustry?: string;
  yearsOfExperience?: number;
  currentJobStartDate?: Date;
  currentlyWorking?: boolean;
  currentJobEndDate?: Date;
  workExperience?: Array<{
    jobTitle: string;
    company: string;
    startDate: Date;
    endDate: Date;
    responsibilities?: string;
  }>;
  internships?: Array<{
    title: string;
    company: string;
    startDate: Date;
    currentlyWorking?: boolean;
    endDate?: Date;
    responsibilities?: string;
  }>;
  highestDegree: string;
  otherDegree?: string;
  institution: string;
  fieldOfStudy: string;
  graduationStatus: "completed" | "pursuing" | "incomplete";
  educationStartDate?: Date;
  educationEndDate?: Date;
  expectedEndDate?: Date;
  additionalEducation?: Array<{
    degree: string;
    otherDegree?: string;
    institution: string;
    fieldOfStudy: string;
    graduationStatus: "completed" | "pursuing" | "incomplete";
    startDate?: Date;
    endDate?: Date;
    expectedEndDate?: Date;
  }>;
  skills: string[];
  certifications?: string[];
  referralAvailability: "provide" | "receive" | "both";
  termsAccepted: boolean;
  preferredLocations?: string[];
  targetCompanies?: string[];
  jobPreferences?: string;
}

export interface PreferencesValues {
  referralAvailability: "provide" | "receive" | "both";
  termsAccepted: boolean;
  preferredLocations?: string[];
  targetCompanies?: string[];
  jobPreferences?: string;
}

export type Skill = string;
export type Certification = string;

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities?: string;
}

export interface ProfessionalValues {
  experienceType: "experienced" | "fresher";
  currentTitle: string;
  currentCompany: string;
  industry: string;
  yearsOfExperience: string;
}

export interface ExperienceValues {
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  responsibilities?: string;
}

export interface ExperienceEditValues {
  id: string;
  title: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  responsibilities?: string;
}

export const stepValidationFields = {
  personal: [
    "firstName",
    "lastName",
    "email",
    "phone",
    "country",
    "countryCode",
    "address",
    "state",
    "pincode",
    "gender",
    "bio",
    "resume",
  ],
  professional: [
    "experienceLevel",
    "currentJobTitle",
    "currentCompany",
    "industry",
    "otherIndustry",
    "yearsOfExperience",
  ],
  education: [
    "highestDegree",
    "otherDegree",
    "institution",
    "fieldOfStudy",
    "graduationStatus",
    "educationStartDate",
    "educationEndDate",
    "expectedEndDate",
  ],
  skills: ["skills"],
  preferences: ["referralAvailability", "termsAccepted"],
};
