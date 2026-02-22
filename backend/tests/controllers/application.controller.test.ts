import { Request, Response, NextFunction } from "express";
import {
  submitApplication,
  listApplications,
  getApplication,
  updateApplicationStatus,
  withdrawApplication,
  getJobApplications,
  getMyApplications,
  getApplicationStats,
} from "../../src/modules/application/controllers/application.controller";
import { applicationService } from "../../src/modules/application/services/application.service";
import { createMockApplication } from "../factories";

// Mock the application service
jest.mock("../../src/modules/application/services/application.service", () => ({
  applicationService: {
    submitApplication: jest.fn(),
    listApplications: jest.fn(),
    getApplication: jest.fn(),
    updateApplicationStatus: jest.fn(),
    withdrawApplication: jest.fn(),
    getApplicationsByJob: jest.fn(),
    getApplicationsByCandidate: jest.fn(),
    getApplicationStats: jest.fn(),
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
    user: { id: "user-123", userType: "job_seeker", organizationId: "org-123" },
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

describe("ApplicationController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== submitApplication ====================
  describe("submitApplication", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await submitApplication(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 201 on successful submission", async () => {
      const mockApp = createMockApplication();
      (applicationService.submitApplication as jest.Mock).mockResolvedValue(mockApp);
      const req = makeReq({
        body: { job_id: "job-123", resume_url: "https://example.com/resume.pdf" },
      });
      const res = makeRes();
      await submitApplication(req, res, mockNext);
      expect(applicationService.submitApplication).toHaveBeenCalledWith(
        req.body,
        "user-123"
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: mockApp })
      );
    });

    it("should return 400 if already applied", async () => {
      (applicationService.submitApplication as jest.Mock).mockRejectedValue(
        new Error("You have already applied for this job")
      );
      const req = makeReq({ body: { job_id: "job-123" } });
      const res = makeRes();
      await submitApplication(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false })
      );
    });

    it("should return 400 if job not found", async () => {
      (applicationService.submitApplication as jest.Mock).mockRejectedValue(
        new Error("Job not found")
      );
      const req = makeReq({ body: { job_id: "nonexistent" } });
      const res = makeRes();
      await submitApplication(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should call next on unexpected error", async () => {
      (applicationService.submitApplication as jest.Mock).mockRejectedValue(
        new Error("Unexpected DB error")
      );
      const req = makeReq({ body: { job_id: "job-123" } });
      const res = makeRes();
      await submitApplication(req, res, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });

  // ==================== listApplications ====================
  describe("listApplications", () => {
    it("should list applications and return 200", async () => {
      const mockResult = {
        applications: [createMockApplication()],
        total: 1,
        pages: 1,
        currentPage: 1,
      };
      (applicationService.listApplications as jest.Mock).mockResolvedValue(mockResult);
      const req = makeReq({ query: {} });
      const res = makeRes();
      await listApplications(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: mockResult })
      );
    });

    it("should pass filters and pagination to service", async () => {
      (applicationService.listApplications as jest.Mock).mockResolvedValue({
        applications: [],
        total: 0,
        pages: 0,
        currentPage: 1,
      });
      const req = makeReq({
        query: { application_status: "submitted", job_id: "job-123", page: "2", limit: "10" },
      });
      const res = makeRes();
      await listApplications(req, res, mockNext);
      expect(applicationService.listApplications).toHaveBeenCalledWith(
        expect.objectContaining({ application_status: "submitted", job_id: "job-123" }),
        expect.objectContaining({ page: 2, limit: 10 }),
        "user-123",
        "org-123"
      );
    });
  });

  // ==================== getApplication ====================
  describe("getApplication", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { applicationId: "app-123" } });
      const res = makeRes();
      await getApplication(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if not found", async () => {
      (applicationService.getApplication as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { applicationId: "nonexistent" } });
      const res = makeRes();
      await getApplication(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 200 with application data", async () => {
      const mockApp = createMockApplication();
      (applicationService.getApplication as jest.Mock).mockResolvedValue(mockApp);
      const req = makeReq({ params: { applicationId: "app-123" } });
      const res = makeRes();
      await getApplication(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: mockApp })
      );
    });
  });

  // ==================== updateApplicationStatus ====================
  describe("updateApplicationStatus", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { applicationId: "app-123" } });
      const res = makeRes();
      await updateApplicationStatus(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if no org context", async () => {
      const req = makeReq({ params: { applicationId: "app-123" }, tenant: undefined });
      const res = makeRes();
      await updateApplicationStatus(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if application not found", async () => {
      (applicationService.updateApplicationStatus as jest.Mock).mockResolvedValue(null);
      const req = makeReq({
        params: { applicationId: "nonexistent" },
        body: { application_status: "reviewed" },
      });
      const res = makeRes();
      await updateApplicationStatus(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 200 on successful status update", async () => {
      const mockApp = createMockApplication({ application_status: "reviewed" });
      (applicationService.updateApplicationStatus as jest.Mock).mockResolvedValue(mockApp);
      const req = makeReq({
        params: { applicationId: "app-123" },
        body: { application_status: "reviewed" },
      });
      const res = makeRes();
      await updateApplicationStatus(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ==================== withdrawApplication ====================
  describe("withdrawApplication", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { applicationId: "app-123" } });
      const res = makeRes();
      await withdrawApplication(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if not found or cannot be withdrawn", async () => {
      (applicationService.withdrawApplication as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { applicationId: "nonexistent" } });
      const res = makeRes();
      await withdrawApplication(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 200 on successful withdrawal", async () => {
      const mockApp = createMockApplication({ application_status: "withdrawn" });
      (applicationService.withdrawApplication as jest.Mock).mockResolvedValue(mockApp);
      const req = makeReq({ params: { applicationId: "app-123" } });
      const res = makeRes();
      await withdrawApplication(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ==================== getJobApplications ====================
  describe("getJobApplications", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { jobId: "job-123" } });
      const res = makeRes();
      await getJobApplications(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if no org context", async () => {
      const req = makeReq({ params: { jobId: "job-123" }, tenant: undefined });
      const res = makeRes();
      await getJobApplications(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 200 with apps for the job", async () => {
      const mockResult = {
        applications: [createMockApplication()],
        total: 1,
        pages: 1,
        currentPage: 1,
      };
      (applicationService.getApplicationsByJob as jest.Mock).mockResolvedValue(mockResult);
      const req = makeReq({ params: { jobId: "job-123" }, query: {} });
      const res = makeRes();
      await getJobApplications(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ==================== getMyApplications ====================
  describe("getMyApplications", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await getMyApplications(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 200 with user's applications", async () => {
      const mockResult = {
        applications: [createMockApplication()],
        total: 1,
        pages: 1,
        currentPage: 1,
      };
      (applicationService.getApplicationsByCandidate as jest.Mock).mockResolvedValue(mockResult);
      const req = makeReq({ query: {} });
      const res = makeRes();
      await getMyApplications(req, res, mockNext);
      expect(applicationService.getApplicationsByCandidate).toHaveBeenCalledWith(
        "user-123",
        expect.any(Object),
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // ==================== getApplicationStats ====================
  describe("getApplicationStats", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { jobId: "job-123" } });
      const res = makeRes();
      await getApplicationStats(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if no org context", async () => {
      const req = makeReq({ params: { jobId: "job-123" }, tenant: undefined });
      const res = makeRes();
      await getApplicationStats(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if job not found", async () => {
      (applicationService.getApplicationStats as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { jobId: "nonexistent" } });
      const res = makeRes();
      await getApplicationStats(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 200 with stats", async () => {
      const stats = { total: 10, submitted: 5, reviewed: 3, hired: 2 };
      (applicationService.getApplicationStats as jest.Mock).mockResolvedValue(stats);
      const req = makeReq({ params: { jobId: "job-123" } });
      const res = makeRes();
      await getApplicationStats(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, data: stats })
      );
    });
  });
});
