import { Request, Response } from "express";
import {
  submitReferral,
  listReferrals,
  getMyReferrals,
  getReferral,
  updateReferralStatus,
  approveReferral,
  rejectReferral,
  getReferralsByJob,
  getReferralStatsByJob,
  getReferralStats,
  processBonusPayment,
} from "../../src/modules/referral/controllers/referral.controller";
import { referralService } from "../../src/modules/referral/services/referral.service";

// Mock the referral service
jest.mock("../../src/modules/referral/services/referral.service", () => ({
  referralService: {
    submitReferral: jest.fn(),
    listReferrals: jest.fn(),
    getReferral: jest.fn(),
    updateReferralStatus: jest.fn(),
    approveReferral: jest.fn(),
    rejectReferral: jest.fn(),
    getReferralsByJob: jest.fn(),
    getReferralStatsByJob: jest.fn(),
    getReferralStats: jest.fn(),
    processBonusPayment: jest.fn(),
  },
}));

// Mock express-validator
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
}));

function makeReq(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    params: {},
    query: {},
    user: { id: "user-123", userType: "org_recruiter" },
    organizationId: "org-123",
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

const mockReferral = {
  id: "ref-123",
  job_id: "job-123",
  referrer_id: "user-123",
  candidate_email: "candidate@example.com",
  status: "pending",
};

describe("ReferralController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== submitReferral ====================
  describe("submitReferral", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await submitReferral(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should submit referral and return 201", async () => {
      (referralService.submitReferral as jest.Mock).mockResolvedValue(mockReferral);
      const req = makeReq({
        body: { job_id: "job-123", candidate_email: "candidate@example.com" },
      });
      const res = makeRes();
      await submitReferral(req, res);
      expect(referralService.submitReferral).toHaveBeenCalledWith(req.body, "user-123");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Referral submitted successfully", referral: mockReferral })
      );
    });

    it("should return 400 on service error", async () => {
      (referralService.submitReferral as jest.Mock).mockRejectedValue(
        new Error("Job not eligible for referrals")
      );
      const req = makeReq({ body: { job_id: "job-123" } });
      const res = makeRes();
      await submitReferral(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // ==================== listReferrals ====================
  describe("listReferrals", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await listReferrals(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if no tenant context", async () => {
      const req = makeReq({ organizationId: undefined });
      const res = makeRes();
      await listReferrals(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should list referrals and return 200", async () => {
      const mockResult = { referrals: [mockReferral], total: 1, pages: 1, currentPage: 1 };
      (referralService.listReferrals as jest.Mock).mockResolvedValue(mockResult);
      const req = makeReq({ query: {} });
      const res = makeRes();
      await listReferrals(req, res);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  // ==================== getMyReferrals ====================
  describe("getMyReferrals", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await getMyReferrals(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should get user's own referrals", async () => {
      const mockResult = { referrals: [mockReferral], total: 1, pages: 1, currentPage: 1 };
      (referralService.listReferrals as jest.Mock).mockResolvedValue(mockResult);
      const req = makeReq({ query: {} });
      const res = makeRes();
      await getMyReferrals(req, res);
      expect(referralService.listReferrals).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        "user-123"
      );
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  // ==================== getReferral ====================
  describe("getReferral", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "ref-123" } });
      const res = makeRes();
      await getReferral(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if not found", async () => {
      (referralService.getReferral as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "nonexistent" } });
      const res = makeRes();
      await getReferral(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 200 with referral data", async () => {
      (referralService.getReferral as jest.Mock).mockResolvedValue(mockReferral);
      const req = makeReq({ params: { id: "ref-123" } });
      const res = makeRes();
      await getReferral(req, res);
      expect(res.json).toHaveBeenCalledWith(mockReferral);
    });
  });

  // ==================== updateReferralStatus ====================
  describe("updateReferralStatus", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "ref-123" } });
      const res = makeRes();
      await updateReferralStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if no tenant context", async () => {
      const req = makeReq({ params: { id: "ref-123" }, organizationId: undefined });
      const res = makeRes();
      await updateReferralStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if not found", async () => {
      (referralService.updateReferralStatus as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "nonexistent" }, body: { status: "reviewed" } });
      const res = makeRes();
      await updateReferralStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should update status and return updated referral", async () => {
      const updated = { ...mockReferral, status: "reviewed" };
      (referralService.updateReferralStatus as jest.Mock).mockResolvedValue(updated);
      const req = makeReq({ params: { id: "ref-123" }, body: { status: "reviewed" } });
      const res = makeRes();
      await updateReferralStatus(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Referral status updated successfully" })
      );
    });
  });

  // ==================== approveReferral ====================
  describe("approveReferral", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "ref-123" } });
      const res = makeRes();
      await approveReferral(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if not found or not pending", async () => {
      (referralService.approveReferral as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "ref-123" } });
      const res = makeRes();
      await approveReferral(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should approve referral successfully", async () => {
      const approved = { ...mockReferral, status: "approved" };
      (referralService.approveReferral as jest.Mock).mockResolvedValue(approved);
      const req = makeReq({ params: { id: "ref-123" } });
      const res = makeRes();
      await approveReferral(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Referral approved successfully" })
      );
    });
  });

  // ==================== rejectReferral ====================
  describe("rejectReferral", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "ref-123" } });
      const res = makeRes();
      await rejectReferral(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if not found", async () => {
      (referralService.rejectReferral as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "ref-123" }, body: { reason: "Not a fit" } });
      const res = makeRes();
      await rejectReferral(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should reject referral successfully", async () => {
      const rejected = { ...mockReferral, status: "rejected" };
      (referralService.rejectReferral as jest.Mock).mockResolvedValue(rejected);
      const req = makeReq({ params: { id: "ref-123" }, body: { reason: "Not a fit" } });
      const res = makeRes();
      await rejectReferral(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Referral rejected successfully" })
      );
    });
  });

  // ==================== getReferralsByJob ====================
  describe("getReferralsByJob", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { jobId: "job-123" } });
      const res = makeRes();
      await getReferralsByJob(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if no tenant context", async () => {
      const req = makeReq({ params: { jobId: "job-123" }, organizationId: undefined });
      const res = makeRes();
      await getReferralsByJob(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return referrals for a job", async () => {
      const mockResult = { referrals: [mockReferral], total: 1, pages: 1, currentPage: 1 };
      (referralService.getReferralsByJob as jest.Mock).mockResolvedValue(mockResult);
      const req = makeReq({ params: { jobId: "job-123" }, query: {} });
      const res = makeRes();
      await getReferralsByJob(req, res);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });
  });

  // ==================== getReferralStatsByJob ====================
  describe("getReferralStatsByJob", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { jobId: "job-123" } });
      const res = makeRes();
      await getReferralStatsByJob(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 if job not found", async () => {
      (referralService.getReferralStatsByJob as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { jobId: "nonexistent" } });
      const res = makeRes();
      await getReferralStatsByJob(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return stats for a job", async () => {
      const stats = { total: 5, pending: 2, approved: 3, rejected: 0 };
      (referralService.getReferralStatsByJob as jest.Mock).mockResolvedValue(stats);
      const req = makeReq({ params: { jobId: "job-123" } });
      const res = makeRes();
      await getReferralStatsByJob(req, res);
      expect(res.json).toHaveBeenCalledWith(stats);
    });
  });

  // ==================== getReferralStats ====================
  describe("getReferralStats", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined });
      const res = makeRes();
      await getReferralStats(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if no tenant context", async () => {
      const req = makeReq({ organizationId: undefined });
      const res = makeRes();
      await getReferralStats(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return organization-level referral stats", async () => {
      const stats = { total: 20, pending: 5, approved: 12, rejected: 3, bonusPaid: 8 };
      (referralService.getReferralStats as jest.Mock).mockResolvedValue(stats);
      const req = makeReq();
      const res = makeRes();
      await getReferralStats(req, res);
      expect(referralService.getReferralStats).toHaveBeenCalledWith("org-123");
      expect(res.json).toHaveBeenCalledWith(stats);
    });
  });

  // ==================== processBonusPayment ====================
  describe("processBonusPayment", () => {
    it("should return 401 if not authenticated", async () => {
      const req = makeReq({ user: undefined, params: { id: "ref-123" } });
      const res = makeRes();
      await processBonusPayment(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 if no tenant context", async () => {
      const req = makeReq({ params: { id: "ref-123" }, organizationId: undefined });
      const res = makeRes();
      await processBonusPayment(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if not found or not eligible", async () => {
      (referralService.processBonusPayment as jest.Mock).mockResolvedValue(null);
      const req = makeReq({ params: { id: "ref-123" }, body: { amount: 5000 } });
      const res = makeRes();
      await processBonusPayment(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should process bonus and return updated referral", async () => {
      const updated = { ...mockReferral, bonus_paid: true, bonus_amount: 5000 };
      (referralService.processBonusPayment as jest.Mock).mockResolvedValue(updated);
      const req = makeReq({ params: { id: "ref-123" }, body: { amount: 5000 } });
      const res = makeRes();
      await processBonusPayment(req, res);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Bonus payment processed successfully" })
      );
    });
  });
});
