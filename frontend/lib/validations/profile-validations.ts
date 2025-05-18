import * as z from "zod";
import { countries } from "country-data-list";

const isPastDate = (date: Date) => {
  return date <= new Date();
};

const isFutureDate = (date: Date) => {
  return date > new Date();
};

const validCountryCodes = countries.all
  .filter((country) => country.status === "assigned")
  .map((country) => country.alpha2);

export const profileSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().regex(/^\d{10}$/, {
      message: "Phone number must be exactly 10 digits.",
    }),
    country: z.string().refine((value) => validCountryCodes.includes(value), {
      message: "Please select a valid country.",
    }),
    countryCode: z.string().regex(/^\+\d{1,4}$/, {
      message: "Please select a valid country code (e.g., +1).",
    }),
    address: z
      .string()
      .min(5, { message: "Address must be at least 5 characters." }),
    state: z.string().min(1, { message: "Please enter your state/province." }),
    pincode: z.string().regex(/^\d{5}(-\d{4})?$|^\d{6}$/, {
      message:
        "Please enter a valid postal/ZIP code (e.g., 12345, 12345-6789, or 123456).",
    }),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select your gender.",
    }),
    bio: z
      .string()
      .min(10, { message: "Bio must be at least 10 characters." })
      .max(1000, {
        message:
          "Bio must not exceed 1000 characters (approximately 200 words).",
      }),
    profilePicture: z.any().optional(),
    resume: z
      .any()
      .refine(
        (file) => {
          if (!file) return true;
          if (typeof file === "object" && file instanceof File) {
            return file.size <= 2 * 1024 * 1024;
          }
          return true;
        },
        {
          message: "Resume file size must be less than 2MB",
        }
      )
      .optional(),

    experienceLevel: z.enum(["experienced", "fresher"], {
      required_error: "Please select your experience level.",
    }),

    currentJobTitle: z.string().optional(),
    currentCompany: z.string().optional(),
    industry: z.string().optional(),
    otherIndustry: z.string().optional(),
    yearsOfExperience: z.number().optional(),
    currentJobStartDate: z.date().optional(),
    currentlyWorking: z.boolean().optional(),
    currentJobEndDate: z.date().optional(),

    workExperience: z
      .array(
        z.object({
          jobTitle: z.string().min(1, { message: "Job title is required." }),
          company: z.string().min(1, { message: "Company name is required." }),
          startDate: z.date(),
          endDate: z.date(),
          responsibilities: z.string().optional(),
        })
      )
      .optional(),

    internships: z
      .array(
        z.object({
          title: z
            .string()
            .min(1, { message: "Internship title is required." }),
          company: z.string().min(1, { message: "Company name is required." }),
          startDate: z.date(),
          currentlyWorking: z.boolean().optional(),
          endDate: z.date().optional(),
          responsibilities: z.string().optional(),
        })
      )
      .optional(),

    highestDegree: z
      .string()
      .min(1, { message: "Please select your highest degree." }),
    otherDegree: z.string().optional(),
    institution: z
      .string()
      .min(1, { message: "Institution name is required." }),
    fieldOfStudy: z.string().min(1, { message: "Field of study is required." }),
    graduationStatus: z.enum(["completed", "pursuing", "incomplete"], {
      required_error: "Please select your graduation status.",
    }),
    educationStartDate: z.date().optional(),
    educationEndDate: z.date().optional(),
    expectedEndDate: z.date().optional(),

    additionalEducation: z
      .array(
        z.object({
          degree: z.string().min(1, { message: "Degree is required." }),
          otherDegree: z.string().optional(),
          institution: z
            .string()
            .min(1, { message: "Institution name is required." }),
          fieldOfStudy: z
            .string()
            .min(1, { message: "Field of study is required." }),
          graduationStatus: z.enum(["completed", "pursuing", "incomplete"]),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          expectedEndDate: z.date().optional(),
        })
      )
      .optional(),

    skills: z
      .array(z.string())
      .min(1, { message: "Please add at least one skill." }),
    certifications: z.array(z.string()).optional(),

    referralAvailability: z.enum(["provide", "receive", "both"], {
      required_error: "Please select your referral availability.",
    }),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions.",
    }),
    preferredLocations: z.array(z.string()).optional(),
    targetCompanies: z.array(z.string()).optional(),
    jobPreferences: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.experienceLevel === "experienced") {
        return (
          !!data.currentJobTitle &&
          !!data.currentCompany &&
          !!data.industry &&
          (data.industry !== "other" || !!data.otherIndustry) &&
          !!data.yearsOfExperience
        );
      }
      return true;
    },
    {
      message: "Please fill in all required professional information fields.",
      path: ["experienceLevel"],
    }
  )
  .refine(
    (data) => {
      if (data.graduationStatus === "completed") {
        return !!data.educationStartDate && !!data.educationEndDate;
      } else if (data.graduationStatus === "pursuing") {
        return !!data.educationStartDate && !!data.expectedEndDate;
      }
      return true;
    },
    {
      message: "Please provide the required education dates.",
      path: ["graduationStatus"],
    }
  )
  .refine(
    (data) => {
      return true;
    },
    {
      message: "Email validation failed.",
      path: ["email"],
    }
  );
