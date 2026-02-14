import { jobService } from "../../src/modules/job/services/job.service";
import { Job } from "../../src/database/models/Job";
import { Organization } from "../../src/database/models/Organization";
import { User } from "../../src/modules/auth/models/User";
import { createMockJob, createMockOrganization, createMockUser } from "../factories";

// Mock the models
jest.mock("../../src/database/models/Job");
jest.mock("../../src/database/models/Organization");
jest.mock("../../src/modules/auth/models/User");

describe("JobService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createJob", () => {
    it("should create a job successfully", async () => {
      const jobData = {
        title: "Senior Software Engineer",
        description: "We are looking for an experienced software engineer to join our team...",
        job_type: "full_time" as const,
        experience_level: "senior" as const,
      };
      const userId = "user-123";
      const organizationId = "org-123";

      const mockJob = createMockJob(jobData);
      (Job.create as jest.Mock).mockResolvedValue(mockJob);

      const result = await jobService.createJob(jobData, userId, organizationId);

      expect(Job.create).toHaveBeenCalledWith({
        ...jobData,
        organization_id: organizationId,
        posted_by: userId,
        posted_date: expect.any(Date),
      });
      expect(result).toEqual(mockJob);
    });
  });

  describe("getJob", () => {
    it("should get a job by ID for public access", async () => {
      const jobId = "job-123";
      const mockJob = createMockJob();

      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);

      const result = await jobService.getJob(jobId);

      expect(Job.findOne).toHaveBeenCalledWith({
        where: { id: jobId, is_active: true },
        include: expect.any(Array),
      });
      expect(mockJob.incrementViews).toHaveBeenCalled();
      expect(result).toEqual(mockJob);
    });

    it("should get a job by ID for organization member", async () => {
      const jobId = "job-123";
      const organizationId = "org-123";
      const mockJob = createMockJob();

      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);

      const result = await jobService.getJob(jobId, organizationId);

      expect(Job.findOne).toHaveBeenCalledWith({
        where: { id: jobId, organization_id: organizationId },
        include: expect.any(Array),
      });
      expect(mockJob.incrementViews).not.toHaveBeenCalled();
      expect(result).toEqual(mockJob);
    });

    it("should return null if job not found", async () => {
      const jobId = "nonexistent";

      (Job.findOne as jest.Mock).mockResolvedValue(null);

      const result = await jobService.getJob(jobId);

      expect(result).toBeNull();
    });
  });

  describe("listJobs", () => {
    it("should list active jobs for public access", async () => {
      const mockJobs = [createMockJob(), createMockJob({ id: "job-456" })];

      (Job.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockJobs,
      });

      const result = await jobService.listJobs({}, { page: 1, limit: 20 });

      expect(Job.findAndCountAll).toHaveBeenCalledWith({
        where: { is_active: true },
        include: expect.any(Array),
        limit: 20,
        offset: 0,
        order: [["posted_date", "DESC"]],
      });
      expect(result).toEqual({
        jobs: mockJobs,
        total: 2,
        pages: 1,
        currentPage: 1,
      });
    });

    it("should list all jobs for organization members", async () => {
      const organizationId = "org-123";
      const mockJobs = [createMockJob(), createMockJob({ id: "job-456", is_active: false })];

      (Job.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockJobs,
      });

      const result = await jobService.listJobs({}, { page: 1, limit: 20 }, organizationId);

      expect(Job.findAndCountAll).toHaveBeenCalledWith({
        where: { organization_id: organizationId },
        include: expect.any(Array),
        limit: 20,
        offset: 0,
        order: [["posted_date", "DESC"]],
      });
      expect(result.jobs).toEqual(mockJobs);
    });

    it("should filter jobs by job_type", async () => {
      const mockJobs = [createMockJob({ job_type: "full_time" })];

      (Job.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: mockJobs,
      });

      await jobService.listJobs({ job_type: "full_time" }, { page: 1, limit: 20 });

      expect(Job.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            is_active: true,
            job_type: "full_time",
          }),
        })
      );
    });

    it("should filter jobs by experience_level", async () => {
      const mockJobs = [createMockJob({ experience_level: "senior" })];

      (Job.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: mockJobs,
      });

      await jobService.listJobs({ experience_level: "senior" }, { page: 1, limit: 20 });

      expect(Job.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            experience_level: "senior",
          }),
        })
      );
    });

    it("should filter jobs by location", async () => {
      (Job.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 0,
        rows: [],
      });

      await jobService.listJobs({ location: "San Francisco" }, { page: 1, limit: 20 });

      expect(Job.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            location: expect.any(Object),
          }),
        })
      );
    });

    it("should search jobs by title and description", async () => {
      (Job.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 0,
        rows: [],
      });

      await jobService.listJobs({ search: "engineer" }, { page: 1, limit: 20 });

      expect(Job.findAndCountAll).toHaveBeenCalled();
    });

    it("should handle pagination correctly", async () => {
      const mockJobs = Array.from({ length: 20 }, (_, i) => createMockJob({ id: `job-${i}` }));

      (Job.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 50,
        rows: mockJobs,
      });

      const result = await jobService.listJobs({}, { page: 2, limit: 20 });

      expect(Job.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          offset: 20,
        })
      );
      expect(result.pages).toBe(3);
      expect(result.currentPage).toBe(2);
    });
  });

  describe("updateJob", () => {
    it("should update a job successfully", async () => {
      const jobId = "job-123";
      const updateData = { title: "Updated Title" };
      const userId = "user-123";
      const organizationId = "org-123";

      const mockJob = createMockJob();
      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);

      const result = await jobService.updateJob(jobId, updateData, userId, organizationId);

      expect(Job.findOne).toHaveBeenCalledWith({
        where: { id: jobId, organization_id: organizationId },
      });
      expect(mockJob.update).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(mockJob);
    });

    it("should return null if job not found", async () => {
      const jobId = "nonexistent";
      const updateData = { title: "Updated Title" };
      const userId = "user-123";
      const organizationId = "org-123";

      (Job.findOne as jest.Mock).mockResolvedValue(null);

      const result = await jobService.updateJob(jobId, updateData, userId, organizationId);

      expect(result).toBeNull();
    });
  });

  describe("deleteJob", () => {
    it("should soft delete a job", async () => {
      const jobId = "job-123";
      const organizationId = "org-123";

      const mockJob = createMockJob();
      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);

      const result = await jobService.deleteJob(jobId, organizationId);

      expect(mockJob.update).toHaveBeenCalledWith({ is_active: false });
      expect(result).toBe(true);
    });

    it("should return false if job not found", async () => {
      const jobId = "nonexistent";
      const organizationId = "org-123";

      (Job.findOne as jest.Mock).mockResolvedValue(null);

      const result = await jobService.deleteJob(jobId, organizationId);

      expect(result).toBe(false);
    });
  });

  describe("closeJob", () => {
    it("should close a job with reason", async () => {
      const jobId = "job-123";
      const reason = "Position filled";
      const organizationId = "org-123";

      const mockJob = createMockJob();
      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);

      const result = await jobService.closeJob(jobId, reason, organizationId);

      expect(mockJob.close).toHaveBeenCalledWith(reason);
      expect(result).toEqual(mockJob);
    });

    it("should return null if job not found", async () => {
      const jobId = "nonexistent";
      const reason = "Position filled";
      const organizationId = "org-123";

      (Job.findOne as jest.Mock).mockResolvedValue(null);

      const result = await jobService.closeJob(jobId, reason, organizationId);

      expect(result).toBeNull();
    });
  });

  describe("reopenJob", () => {
    it("should reopen a closed job", async () => {
      const jobId = "job-123";
      const organizationId = "org-123";

      const mockJob = createMockJob({ is_active: false });
      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);

      const result = await jobService.reopenJob(jobId, organizationId);

      expect(mockJob.reopen).toHaveBeenCalled();
      expect(result).toEqual(mockJob);
    });
  });

  describe("getJobStats", () => {
    it("should get job statistics", async () => {
      const jobId = "job-123";
      const organizationId = "org-123";

      const mockJob = createMockJob({
        view_count: 150,
        application_count: 25,
      });
      const mockReferrals = [{}, {}, {}]; // 3 referrals

      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      mockJob.getReferrals = jest.fn().mockResolvedValue(mockReferrals);

      const result = await jobService.getJobStats(jobId, organizationId);

      expect(result).toEqual({
        viewCount: 150,
        applicationCount: 25,
        referralCount: 3,
      });
    });

    it("should return null if job not found", async () => {
      const jobId = "nonexistent";
      const organizationId = "org-123";

      (Job.findOne as jest.Mock).mockResolvedValue(null);

      const result = await jobService.getJobStats(jobId, organizationId);

      expect(result).toBeNull();
    });
  });
});
