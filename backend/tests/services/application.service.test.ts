import { applicationService } from "../../src/modules/application/services/application.service";
import { Application } from "../../src/database/models/Application";
import { Job } from "../../src/database/models/Job";
import { User } from "../../src/modules/auth/models/User";
import { Organization } from "../../src/database/models/Organization";
import { createMockApplication, createMockJob } from "../factories";

// Mock the models
jest.mock("../../src/database/models/Application");
jest.mock("../../src/database/models/Job");
jest.mock("../../src/modules/auth/models/User");
jest.mock("../../src/database/models/Organization");

describe("ApplicationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("submitApplication", () => {
    it("should submit an application successfully", async () => {
      const applicationData = {
        job_id: "job-123",
        cover_letter: "I am excited to apply...",
        resume_url: "https://example.com/resume.pdf",
      };
      const userId = "user-123";

      const mockJob = createMockJob({ organization_id: "org-123" });
      const mockApplication = createMockApplication(applicationData);

      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      (Application.findOne as jest.Mock).mockResolvedValue(null); // No existing application
      (Application.create as jest.Mock).mockResolvedValue(mockApplication);

      const result = await applicationService.submitApplication(applicationData, userId);

      expect(Job.findOne).toHaveBeenCalledWith({
        where: { id: "job-123", is_active: true },
      });
      expect(Application.create).toHaveBeenCalledWith({
        ...applicationData,
        applicant_id: userId,
        organization_id: "org-123",
        application_status: "submitted",
        applied_date: expect.any(Date),
      });
      expect(mockJob.incrementApplications).toHaveBeenCalled();
      expect(result).toEqual(mockApplication);
    });

    it("should fail if job is not active", async () => {
      const applicationData = {
        job_id: "job-123",
        cover_letter: "I am excited to apply...",
      };
      const userId = "user-123";

      (Job.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        applicationService.submitApplication(applicationData, userId)
      ).rejects.toThrow("Job not found or not accepting applications");
    });

    it("should prevent duplicate applications", async () => {
      const applicationData = {
        job_id: "job-123",
        cover_letter: "I am excited to apply...",
      };
      const userId = "user-123";

      const mockJob = createMockJob();
      const existingApplication = createMockApplication({
        job_id: "job-123",
        applicant_id: userId,
        application_status: "submitted",
      });

      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      (Application.findOne as jest.Mock).mockResolvedValue(existingApplication);

      await expect(
        applicationService.submitApplication(applicationData, userId)
      ).rejects.toThrow("You have already applied to this job");
    });

    it("should allow reapplication if previous was withdrawn", async () => {
      const applicationData = {
        job_id: "job-123",
        cover_letter: "I am excited to apply...",
      };
      const userId = "user-123";

      const mockJob = createMockJob({ organization_id: "org-123" });
      const mockApplication = createMockApplication();

      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      (Application.findOne as jest.Mock).mockResolvedValue(null); // Withdrawn app not found
      (Application.create as jest.Mock).mockResolvedValue(mockApplication);

      const result = await applicationService.submitApplication(applicationData, userId);

      expect(result).toEqual(mockApplication);
    });
  });

  describe("getApplication", () => {
    it("should get application by ID for owner", async () => {
      const applicationId = "app-123";
      const userId = "user-123";

      const mockApplication = createMockApplication({ applicant_id: userId });
      (Application.findOne as jest.Mock).mockResolvedValue(mockApplication);

      const result = await applicationService.getApplication(applicationId, userId);

      expect(Application.findOne).toHaveBeenCalledWith({
        where: { id: applicationId, applicant_id: userId },
        include: expect.any(Array),
      });
      expect(result).toEqual(mockApplication);
    });

    it("should get application by ID for organization recruiter", async () => {
      const applicationId = "app-123";
      const userId = "user-123";
      const organizationId = "org-123";

      const mockApplication = createMockApplication();
      (Application.findOne as jest.Mock).mockResolvedValue(mockApplication);

      const result = await applicationService.getApplication(
        applicationId,
        userId,
        organizationId
      );

      expect(Application.findOne).toHaveBeenCalledWith({
        where: { id: applicationId, organization_id: organizationId },
        include: expect.any(Array),
      });
      expect(result).toEqual(mockApplication);
    });

    it("should return null if application not found", async () => {
      const applicationId = "nonexistent";
      const userId = "user-123";

      (Application.findOne as jest.Mock).mockResolvedValue(null);

      const result = await applicationService.getApplication(applicationId, userId);

      expect(result).toBeNull();
    });
  });

  describe("listApplications", () => {
    it("should list own applications for candidate", async () => {
      const userId = "user-123";
      const mockApplications = [
        createMockApplication(),
        createMockApplication({ id: "app-456" }),
      ];

      (Application.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockApplications,
      });

      const result = await applicationService.listApplications({}, {}, userId);

      expect(Application.findAndCountAll).toHaveBeenCalledWith({
        where: { applicant_id: userId },
        include: expect.any(Array),
        limit: 20,
        offset: 0,
        order: [["applied_date", "DESC"]],
      });
      expect(result.applications).toEqual(mockApplications);
    });

    it("should list all organization applications for recruiter", async () => {
      const userId = "user-123";
      const organizationId = "org-123";
      const mockApplications = [createMockApplication()];

      (Application.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: mockApplications,
      });

      const result = await applicationService.listApplications(
        {},
        {},
        userId,
        organizationId
      );

      expect(Application.findAndCountAll).toHaveBeenCalledWith({
        where: { organization_id: organizationId },
        include: expect.any(Array),
        limit: 20,
        offset: 0,
        order: [["applied_date", "DESC"]],
      });
      expect(result.applications).toEqual(mockApplications);
    });

    it("should filter applications by status", async () => {
      const userId = "user-123";
      const organizationId = "org-123";

      (Application.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 0,
        rows: [],
      });

      await applicationService.listApplications(
        { application_status: "screening" },
        {},
        userId,
        organizationId
      );

      expect(Application.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            application_status: "screening",
          }),
        })
      );
    });

    it("should filter applications by job", async () => {
      const userId = "user-123";
      const organizationId = "org-123";

      (Application.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 0,
        rows: [],
      });

      await applicationService.listApplications(
        { job_id: "job-123" },
        {},
        userId,
        organizationId
      );

      expect(Application.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            job_id: "job-123",
          }),
        })
      );
    });

    it("should handle pagination correctly", async () => {
      const userId = "user-123";
      const mockApplications = Array.from({ length: 20 }, (_, i) =>
        createMockApplication({ id: `app-${i}` })
      );

      (Application.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 50,
        rows: mockApplications,
      });

      const result = await applicationService.listApplications(
        {},
        { page: 2, limit: 20 },
        userId
      );

      expect(Application.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          offset: 20,
        })
      );
      expect(result.pages).toBe(3);
      expect(result.currentPage).toBe(2);
    });
  });

  describe("updateApplicationStatus", () => {
    it("should update application status successfully", async () => {
      const applicationId = "app-123";
      const statusData = {
        application_status: "screening" as const,
        notes: "Good candidate",
      };
      const userId = "recruiter-123";
      const organizationId = "org-123";

      const mockApplication = createMockApplication();
      (Application.findOne as jest.Mock).mockResolvedValue(mockApplication);

      const result = await applicationService.updateApplicationStatus(
        applicationId,
        statusData,
        userId,
        organizationId
      );

      expect(mockApplication.update).toHaveBeenCalledWith({
        application_status: "screening",
        notes: "Good candidate",
        rejection_reason: undefined,
        offer_details: undefined,
        last_updated_by: userId,
        reviewed_by: userId,
        hired_date: mockApplication.hired_date,
      });
      expect(result).toEqual(mockApplication);
    });

    it("should set hired_date when status is hired", async () => {
      const applicationId = "app-123";
      const statusData = {
        application_status: "hired" as const,
      };
      const userId = "recruiter-123";
      const organizationId = "org-123";

      const mockApplication = createMockApplication();
      (Application.findOne as jest.Mock).mockResolvedValue(mockApplication);

      await applicationService.updateApplicationStatus(
        applicationId,
        statusData,
        userId,
        organizationId
      );

      expect(mockApplication.update).toHaveBeenCalledWith(
        expect.objectContaining({
          hired_date: expect.any(Date),
        })
      );
    });

    it("should return null if application not found", async () => {
      const applicationId = "nonexistent";
      const statusData = {
        application_status: "screening" as const,
      };
      const userId = "recruiter-123";
      const organizationId = "org-123";

      (Application.findOne as jest.Mock).mockResolvedValue(null);

      const result = await applicationService.updateApplicationStatus(
        applicationId,
        statusData,
        userId,
        organizationId
      );

      expect(result).toBeNull();
    });
  });

  describe("withdrawApplication", () => {
    it("should withdraw application successfully", async () => {
      const applicationId = "app-123";
      const userId = "user-123";

      const mockApplication = createMockApplication({
        applicant_id: userId,
        application_status: "submitted",
      });
      (Application.findOne as jest.Mock).mockResolvedValue(mockApplication);

      const result = await applicationService.withdrawApplication(applicationId, userId);

      expect(mockApplication.update).toHaveBeenCalledWith({
        application_status: "withdrawn",
        last_updated_by: userId,
      });
      expect(result).toEqual(mockApplication);
    });

    it("should not allow withdrawing hired applications", async () => {
      const applicationId = "app-123";
      const userId = "user-123";

      (Application.findOne as jest.Mock).mockResolvedValue(null); // Hired apps excluded

      const result = await applicationService.withdrawApplication(applicationId, userId);

      expect(result).toBeNull();
    });

    it("should not allow withdrawing already withdrawn applications", async () => {
      const applicationId = "app-123";
      const userId = "user-123";

      (Application.findOne as jest.Mock).mockResolvedValue(null); // Withdrawn apps excluded

      const result = await applicationService.withdrawApplication(applicationId, userId);

      expect(result).toBeNull();
    });
  });

  describe("getApplicationsByJob", () => {
    it("should get applications for a job", async () => {
      const jobId = "job-123";
      const organizationId = "org-123";

      const mockJob = createMockJob({ organization_id: organizationId });
      const mockApplications = [createMockApplication({ job_id: jobId })];

      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      (Application.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: mockApplications,
      });

      const result = await applicationService.getApplicationsByJob(
        jobId,
        {},
        {},
        organizationId
      );

      expect(Job.findOne).toHaveBeenCalledWith({
        where: { id: jobId, organization_id: organizationId },
      });
      expect(result.applications).toEqual(mockApplications);
    });

    it("should throw error if job not found", async () => {
      const jobId = "nonexistent";
      const organizationId = "org-123";

      (Job.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        applicationService.getApplicationsByJob(jobId, {}, {}, organizationId)
      ).rejects.toThrow("Job not found");
    });
  });

  describe("getApplicationStats", () => {
    it("should get application statistics for a job", async () => {
      const jobId = "job-123";
      const organizationId = "org-123";

      const mockJob = createMockJob();
      const mockApplications = [
        createMockApplication({ application_status: "submitted" }),
        createMockApplication({ application_status: "submitted" }),
        createMockApplication({ application_status: "screening" }),
        createMockApplication({ application_status: "hired" }),
      ];

      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      (Application.findAll as jest.Mock).mockResolvedValue(mockApplications);

      const result = await applicationService.getApplicationStats(jobId, organizationId);

      expect(result).toEqual({
        total: 4,
        byStatus: {
          submitted: 2,
          screening: 1,
          hired: 1,
        },
      });
    });

    it("should return null if job not found", async () => {
      const jobId = "nonexistent";
      const organizationId = "org-123";

      (Job.findOne as jest.Mock).mockResolvedValue(null);

      const result = await applicationService.getApplicationStats(jobId, organizationId);

      expect(result).toBeNull();
    });
  });
});
