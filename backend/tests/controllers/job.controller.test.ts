import { Request, Response, NextFunction } from "express";
import {
  createJob,
  listJobs,
  getJob,
  updateJob,
  deleteJob,
  closeJob,
  reopenJob,
  getJobStats,
} from "../../src/modules/job/controllers/job.controller";
import { jobService } from "../../src/modules/job/services/job.service";
import { createMockJob } from "../factories";

// Mock the job service
jest.mock("../../src/modules/job/services/job.service", () => ({
  jobService: {
    createJob: jest.fn(),
    listJobs: jest.fn(),
    getJob: jest.fn(),
    updateJob: jest.fn(),
    deleteJob: jest.fn(),
    closeJob: jest.fn(),
    reopenJob: jest.fn(),
    getJobStats: jest.fn(),
  },
}));

// Mock express-validator
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
}));

const mockNext: NextFunction = jest.fn();

function makeReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    query: {},
    user: { id: "user-123", userType: "org_recruiter", organizationId: "org-123" },
    tenant: { organizationId: "org-123" },
    ...overrides,
  } as unknown as Request;
}

function makeRes(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as unknown as Response;
}

describe("JobController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== createJob ====================
  describe("createJob", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await createJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: "Authentication required" })
      );
    });

    it("should return 400 if no organization context", async () => {
      const req = makeReq({ tenant: undefined });
      const res = makeRes();
      await createJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Organization context is required" })
      );
    });

    it("should create a job and return 201", async () => {
      const mockJob = createMockJob();
      (jobService.createJob as jest.Mock).mockResolvedValue(mockJob);
      const req = makeReq({ body: { title: "Engineer" } });
      const res = makeRes();
      await createJob(req, res, mockNext);
      expect(jobService.createJob).toHaveBeenCalledWith(
        { title: "Engineer" },
        "user-123",
        "org-123"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: mockJob })
      );
    });

    it("should call next on unexpected error", async () => {
      const error = new Error("DB error");
      (jobService.createJob as jest.Mock).mockRejectedValue(error);
      const req = makeReq({ body: {} });
      const res = makeRes();
      await createJob(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  // ==================== listJobs ====================
  describe("listJobs", () => {
    it("should list jobs with default pagination", async () => {
      const mockResult = { jobs: [createMockJob()], total: 1, pages: 1, currentPage: 1 };
      (jobService.listJobs as jest.Mock).mockResolvedValue(mockResult);
      const req = makeReq({ query: {} });
      const res = makeRes();
      await listJobs(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: mockResult })
      );
    });

    it("should pass query filters to the service", async () => {
      const mockResult = { jobs: [], total: 0, pages: 0, currentPage: 1 };
      (jobService.listJobs as jest.Mock).mockResolvedValue(mockResult);
      const req = makeReq({
        query: { job_type: "full_time", experience_level: "senior", page: "2", limit: "10" },
      });
      const res = makeRes();
      await listJobs(req, res, mockNext);
      expect(jobService.listJobs).toHaveBeenCalledWith(
        expect.objectContaining({ job_type: "full_time", experience_level: "senior" }),
        expect.objectContaining({ page: 2, limit: 10 }),
        "org-123"
      );
    });

    it("should call next on error", async () => {
      (jobService.listJobs as jest.Mock).mockRejectedValue(new Error("fail"));
      const req = makeReq({ query: {} });
      const res = makeRes();
      await listJobs(req, res, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  // ==================== getJob ====================
  describe("getJob", () => {
    it("should return 404 if job not found", async () => {
      (jobService.getJob as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { jobId: "nonexistent" } });
      const res = makeRes();
      await getJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return the job if found", async () => {
      const mockJob = createMockJob();
      (jobService.getJob as jest.Mock).mockResolvedValue(mockJob);
      const req = makeReq({ params: { jobId: "job-123" } });
      const res = makeRes();
      await getJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: mockJob })
      );
    });
  });

  // ==================== updateJob ====================
  describe("updateJob", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { jobId: "job-123" } });
      const res = makeRes();
      await updateJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if job not found", async () => {
      (jobService.updateJob as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { jobId: "nonexistent" }, body: {} });
      const res = makeRes();
      await updateJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should update and return 200", async () => {
      const mockJob = createMockJob({ title: "Updated" });
      (jobService.updateJob as jest.Mock).mockResolvedValue(mockJob);
      const req = makeReq({ params: { jobId: "job-123" }, body: { title: "Updated" } });
      const res = makeRes();
      await updateJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: mockJob })
      );
    });
  });

  // ==================== deleteJob ====================
  describe("deleteJob", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { jobId: "job-123" } });
      const res = makeRes();
      await deleteJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if job not found", async () => {
      (jobService.deleteJob as jest.Mock).mockResolvedValue(false);
      const req = makeReq({ params: { jobId: "nonexistent" } });
      const res = makeRes();
      await deleteJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 200 on successful delete", async () => {
      (jobService.deleteJob as jest.Mock).mockResolvedValue(true);
      const req = makeReq({ params: { jobId: "job-123" } });
      const res = makeRes();
      await deleteJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: "Job deleted successfully" })
      );
    });
  });

  // ==================== closeJob ====================
  describe("closeJob", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { jobId: "job-123" } });
      const res = makeRes();
      await closeJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if job not found", async () => {
      (jobService.closeJob as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { jobId: "nonexistent" }, body: { reason: "Filled" } });
      const res = makeRes();
      await closeJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should close job and return 200", async () => {
      const mockJob = createMockJob({ is_active: false });
      (jobService.closeJob as jest.Mock).mockResolvedValue(mockJob);
      const req = makeReq({ params: { jobId: "job-123" }, body: { reason: "Position filled" } });
      const res = makeRes();
      await closeJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: "Job closed successfully" })
      );
    });
  });

  // ==================== reopenJob ====================
  describe("reopenJob", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { jobId: "job-123" } });
      const res = makeRes();
      await reopenJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if job not found", async () => {
      (jobService.reopenJob as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { jobId: "nonexistent" } });
      const res = makeRes();
      await reopenJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should reopen job and return 200", async () => {
      const mockJob = createMockJob({ is_active: true });
      (jobService.reopenJob as jest.Mock).mockResolvedValue(mockJob);
      const req = makeReq({ params: { jobId: "job-123" } });
      const res = makeRes();
      await reopenJob(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: "Job reopened successfully" })
      );
    });
  });

  // ==================== getJobStats ====================
  describe("getJobStats", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { jobId: "job-123" } });
      const res = makeRes();
      await getJobStats(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if job not found", async () => {
      (jobService.getJobStats as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { jobId: "nonexistent" } });
      const res = makeRes();
      await getJobStats(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return stats on success", async () => {
      const stats = { viewCount: 150, applicationCount: 25, referralCount: 3 };
      (jobService.getJobStats as jest.Mock).mockResolvedValue(stats);
      const req = makeReq({ params: { jobId: "job-123" } });
      const res = makeRes();
      await getJobStats(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: stats })
      );
    });
  });
});
