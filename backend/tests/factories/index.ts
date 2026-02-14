import { Job } from "../../src/database/models/Job";
import { Application } from "../../src/database/models/Application";
import { User } from "../../src/modules/auth/models/User";
import { Organization } from "../../src/database/models/Organization";

/**
 * Create a mock job for testing
 */
export const createMockJob = (overrides: Partial<any> = {}): any => {
  return {
    id: "job-123",
    organization_id: "org-123",
    posted_by: "user-123",
    title: "Senior Software Engineer",
    description: "We are looking for an experienced software engineer to join our team. You will work on exciting projects...",
    requirements: { experience: "5+ years", skills: ["JavaScript", "TypeScript"] },
    location: "San Francisco, CA",
    job_type: "full_time",
    experience_level: "senior",
    salary_range_min: 120000,
    salary_range_max: 180000,
    currency: "USD",
    skills_required: ["JavaScript", "React", "Node.js"],
    benefits: ["Health Insurance", "401k"],
    is_active: true,
    is_referral_eligible: true,
    referral_bonus: 5000,
    application_deadline: new Date("2024-12-31"),
    posted_date: new Date(),
    closed_date: null,
    closed_reason: null,
    view_count: 0,
    application_count: 0,
    created_at: new Date(),
    updated_at: new Date(),
    close: jest.fn(),
    reopen: jest.fn(),
    incrementViews: jest.fn(),
    incrementApplications: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    ...overrides,
  };
};

/**
 * Create a mock application for testing
 */
export const createMockApplication = (overrides: Partial<any> = {}): any => {
  return {
    id: "app-123",
    job_id: "job-123",
    applicant_id: "user-123",
    referral_id: null,
    organization_id: "org-123",
    application_status: "submitted",
    resume_url: "https://example.com/resume.pdf",
    cover_letter: "I am excited to apply for this position...",
    applied_date: new Date(),
    reviewed_by: null,
    last_updated_by: null,
    rejection_reason: null,
    offer_details: null,
    hired_date: null,
    notes: null,
    created_at: new Date(),
    updated_at: new Date(),
    save: jest.fn(),
    update: jest.fn(),
    ...overrides,
  };
};

/**
 * Create a mock user for testing
 */
export const createMockUser = (overrides: Partial<any> = {}): any => {
  return {
    id: "user-123",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    userType: "job_seeker",
    isActive: true,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
};

/**
 * Create a mock organization for testing
 */
export const createMockOrganization = (overrides: Partial<any> = {}): any => {
  return {
    id: "org-123",
    name: "Tech Corp",
    description: "A leading technology company",
    industry: "Technology",
    size: "100-500",
    location: "San Francisco, CA",
    website: "https://techcorp.com",
    logo: "https://techcorp.com/logo.png",
    isActive: true,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  };
};
