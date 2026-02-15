import { ReferralService } from "../../src/modules/referral/services/referral.service";
import { Referral } from "../../src/database/models/Referral";
import { Employee } from "../../src/database/models/Employee";
import { Job } from "../../src/database/models/Job";
import { User } from "../../src/modules/auth/models/User";
import { Application } from "../../src/database/models/Application";

// Mock the models
jest.mock("../../src/database/models/Referral");
jest.mock("../../src/database/models/Employee");
jest.mock("../../src/database/models/Job");
jest.mock("../../src/modules/auth/models/User");
jest.mock("../../src/database/models/Application");

describe("ReferralService", () => {
  let referralService: ReferralService;

  beforeEach(() => {
    referralService = new ReferralService();
    jest.clearAllMocks();
  });

  describe("submitReferral", () => {
    const mockUserId = "user-123";
    const mockOrgId = "org-123";
    const mockJobId = "job-123";
    const mockCandidateId = "candidate-123";

    const mockEmployee = {
      id: "emp-123",
      user_id: mockUserId,
      organization_id: mockOrgId,
      is_currently_employed: true,
    };

    const mockJob = {
      id: mockJobId,
      organization_id: mockOrgId,
      is_active: true,
    };

    const mockCandidate = {
      id: mockCandidateId,
      email: "candidate@example.com",
    };

    it("should successfully submit a referral", async () => {
      const referralData = {
        job_id: mockJobId,
        candidate_id: mockCandidateId,
        referral_type: "external" as const,
        referral_note: "Great candidate",
      };

      (Employee.findOne as jest.Mock).mockResolvedValue(mockEmployee);
      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      (User.findByPk as jest.Mock).mockResolvedValue(mockCandidate);
      (Referral.findOne as jest.Mock).mockResolvedValue(null);
      (Referral.create as jest.Mock).mockResolvedValue({
        id: "ref-123",
        ...referralData,
        organization_id: mockOrgId,
        referrer_id: mockUserId,
        status: "pending",
      });

      const result = await referralService.submitReferral(referralData, mockUserId);

      expect(result).toBeDefined();
      expect(result.status).toBe("pending");
      expect(Employee.findOne).toHaveBeenCalledWith({
        where: {
          user_id: mockUserId,
          is_currently_employed: true,
        },
      });
      expect(Job.findOne).toHaveBeenCalledWith({
        where: {
          id: mockJobId,
          is_active: true,
        },
      });
    });

    it("should throw error if user is not an employee", async () => {
      (Employee.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        referralService.submitReferral(
          {
            job_id: mockJobId,
            candidate_id: mockCandidateId,
            referral_type: "external",
          },
          mockUserId
        )
      ).rejects.toThrow("Only current employees can submit referrals");
    });

    it("should throw error if job is not found or inactive", async () => {
      (Employee.findOne as jest.Mock).mockResolvedValue(mockEmployee);
      (Job.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        referralService.submitReferral(
          {
            job_id: mockJobId,
            candidate_id: mockCandidateId,
            referral_type: "external",
          },
          mockUserId
        )
      ).rejects.toThrow("Job not found or not accepting applications");
    });

    it("should throw error if employee and job are in different organizations", async () => {
      (Employee.findOne as jest.Mock).mockResolvedValue(mockEmployee);
      (Job.findOne as jest.Mock).mockResolvedValue({
        ...mockJob,
        organization_id: "different-org",
      });

      await expect(
        referralService.submitReferral(
          {
            job_id: mockJobId,
            candidate_id: mockCandidateId,
            referral_type: "external",
          },
          mockUserId
        )
      ).rejects.toThrow("You can only submit referrals for jobs in your organization");
    });

    it("should throw error if referral already exists", async () => {
      (Employee.findOne as jest.Mock).mockResolvedValue(mockEmployee);
      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      (Referral.findOne as jest.Mock).mockResolvedValue({ id: "existing-ref" });

      await expect(
        referralService.submitReferral(
          {
            job_id: mockJobId,
            candidate_id: mockCandidateId,
            referral_type: "external",
          },
          mockUserId
        )
      ).rejects.toThrow("A referral already exists for this candidate and job");
    });

    it("should throw error if candidate not found", async () => {
      (Employee.findOne as jest.Mock).mockResolvedValue(mockEmployee);
      (Job.findOne as jest.Mock).mockResolvedValue(mockJob);
      (Referral.findOne as jest.Mock).mockResolvedValue(null);
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        referralService.submitReferral(
          {
            job_id: mockJobId,
            candidate_id: mockCandidateId,
            referral_type: "external",
          },
          mockUserId
        )
      ).rejects.toThrow("Candidate not found");
    });
  });

  describe("approveReferral", () => {
    const mockReferralId = "ref-123";
    const mockUserId = "user-123";
    const mockOrgId = "org-123";

    it("should successfully approve a referral", async () => {
      const mockReferral = {
        id: mockReferralId,
        organization_id: mockOrgId,
        status: "pending",
        accept: jest.fn().mockResolvedValue(undefined),
      };

      (Referral.findOne as jest.Mock).mockResolvedValue(mockReferral);

      const result = await referralService.approveReferral(
        mockReferralId,
        mockUserId,
        mockOrgId
      );

      expect(result).toBeDefined();
      expect(mockReferral.accept).toHaveBeenCalledWith(mockUserId);
      expect(Referral.findOne).toHaveBeenCalledWith({
        where: {
          id: mockReferralId,
          organization_id: mockOrgId,
          status: "pending",
        },
      });
    });

    it("should return null if referral not found", async () => {
      (Referral.findOne as jest.Mock).mockResolvedValue(null);

      const result = await referralService.approveReferral(
        mockReferralId,
        mockUserId,
        mockOrgId
      );

      expect(result).toBeNull();
    });

    it("should return null if referral is not in pending status", async () => {
      (Referral.findOne as jest.Mock).mockResolvedValue(null);

      const result = await referralService.approveReferral(
        mockReferralId,
        mockUserId,
        mockOrgId
      );

      expect(result).toBeNull();
    });
  });

  describe("rejectReferral", () => {
    const mockReferralId = "ref-123";
    const mockUserId = "user-123";
    const mockOrgId = "org-123";

    it("should successfully reject a referral", async () => {
      const mockReferral = {
        id: mockReferralId,
        organization_id: mockOrgId,
        status: "pending",
        reject: jest.fn().mockResolvedValue(undefined),
      };

      (Referral.findOne as jest.Mock).mockResolvedValue(mockReferral);

      const result = await referralService.rejectReferral(
        mockReferralId,
        { rejection_reason: "Not qualified" },
        mockUserId,
        mockOrgId
      );

      expect(result).toBeDefined();
      expect(mockReferral.reject).toHaveBeenCalledWith(mockUserId, "Not qualified");
    });

    it("should return null if referral not found", async () => {
      (Referral.findOne as jest.Mock).mockResolvedValue(null);

      const result = await referralService.rejectReferral(
        mockReferralId,
        { rejection_reason: "Not qualified" },
        mockUserId,
        mockOrgId
      );

      expect(result).toBeNull();
    });
  });

  describe("updateReferralStatus", () => {
    const mockReferralId = "ref-123";
    const mockUserId = "user-123";
    const mockOrgId = "org-123";

    it("should successfully update referral status to application_submitted", async () => {
      const mockReferral = {
        id: mockReferralId,
        organization_id: mockOrgId,
        status: "accepted",
        update: jest.fn().mockResolvedValue(undefined),
      };

      (Referral.findOne as jest.Mock).mockResolvedValue(mockReferral);

      const result = await referralService.updateReferralStatus(
        mockReferralId,
        { status: "application_submitted" },
        mockUserId,
        mockOrgId
      );

      expect(result).toBeDefined();
      expect(mockReferral.update).toHaveBeenCalledWith({
        status: "application_submitted",
        recruiter_reviewed_by: mockUserId,
        reviewed_at: expect.any(Date),
      });
    });

    it("should successfully update referral status to hired", async () => {
      const mockReferral = {
        id: mockReferralId,
        organization_id: mockOrgId,
        status: "application_submitted",
        update: jest.fn().mockResolvedValue(undefined),
      };

      (Referral.findOne as jest.Mock).mockResolvedValue(mockReferral);

      const result = await referralService.updateReferralStatus(
        mockReferralId,
        { status: "hired" },
        mockUserId,
        mockOrgId
      );

      expect(result).toBeDefined();
      expect(mockReferral.update).toHaveBeenCalledWith({
        status: "hired",
        recruiter_reviewed_by: mockUserId,
        reviewed_at: expect.any(Date),
      });
    });

    it("should return null if referral not found", async () => {
      (Referral.findOne as jest.Mock).mockResolvedValue(null);

      const result = await referralService.updateReferralStatus(
        mockReferralId,
        { status: "hired" },
        mockUserId,
        mockOrgId
      );

      expect(result).toBeNull();
    });
  });

  describe("processBonusPayment", () => {
    const mockReferralId = "ref-123";
    const mockUserId = "user-123";
    const mockOrgId = "org-123";

    it("should successfully process bonus payment", async () => {
      const mockReferral = {
        id: mockReferralId,
        organization_id: mockOrgId,
        status: "hired",
        update: jest.fn().mockResolvedValue(undefined),
      };

      (Referral.findOne as jest.Mock).mockResolvedValue(mockReferral);

      const bonusData = {
        bonus_amount: 5000,
        payment_date: new Date(),
      };

      const result = await referralService.processBonusPayment(
        mockReferralId,
        bonusData,
        mockUserId,
        mockOrgId
      );

      expect(result).toBeDefined();
      expect(mockReferral.update).toHaveBeenCalledWith({
        bonus_amount: 5000,
        bonus_paid_date: bonusData.payment_date,
        status: "bonus_paid",
      });
    });

    it("should return null if referral not in hired status", async () => {
      (Referral.findOne as jest.Mock).mockResolvedValue(null);

      const result = await referralService.processBonusPayment(
        mockReferralId,
        { bonus_amount: 5000 },
        mockUserId,
        mockOrgId
      );

      expect(result).toBeNull();
    });
  });

  describe("listReferrals", () => {
    const mockOrgId = "org-123";

    it("should list referrals with organization context", async () => {
      const mockReferrals = [
        { id: "ref-1", status: "pending" },
        { id: "ref-2", status: "accepted" },
      ];

      (Referral.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 2,
        rows: mockReferrals,
      });

      const result = await referralService.listReferrals(
        {},
        { page: 1, limit: 20 },
        undefined,
        mockOrgId
      );

      expect(result.referrals).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.pages).toBe(1);
      expect(result.currentPage).toBe(1);
    });

    it("should filter referrals by status", async () => {
      (Referral.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "ref-1", status: "pending" }],
      });

      const result = await referralService.listReferrals(
        { status: "pending" },
        { page: 1, limit: 20 },
        undefined,
        mockOrgId
      );

      expect(Referral.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: "pending",
          }),
        })
      );
    });

    it("should filter referrals by job_id", async () => {
      const mockJobId = "job-123";

      (Referral.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [{ id: "ref-1", job_id: mockJobId }],
      });

      await referralService.listReferrals(
        { job_id: mockJobId },
        { page: 1, limit: 20 },
        undefined,
        mockOrgId
      );

      expect(Referral.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            job_id: mockJobId,
          }),
        })
      );
    });
  });

  describe("getReferral", () => {
    it("should return referral by id", async () => {
      const mockReferral = {
        id: "ref-123",
        status: "pending",
      };

      (Referral.findOne as jest.Mock).mockResolvedValue(mockReferral);

      const result = await referralService.getReferral("ref-123", "user-123");

      expect(result).toEqual(mockReferral);
      expect(Referral.findOne).toHaveBeenCalled();
    });

    it("should return null if referral not found", async () => {
      (Referral.findOne as jest.Mock).mockResolvedValue(null);

      const result = await referralService.getReferral("non-existent", "user-123");

      expect(result).toBeNull();
    });
  });

  describe("getReferralStats", () => {
    const mockOrgId = "org-123";

    it("should return referral statistics", async () => {
      const mockReferrals = [
        { status: "pending", referral_type: "external", isBonusPayable: () => false },
        { status: "pending", referral_type: "external", isBonusPayable: () => false },
        { status: "accepted", referral_type: "internal", isBonusPayable: () => false },
        { status: "hired", referral_type: "external", bonus_amount: 5000, isBonusPayable: () => true },
        { status: "bonus_paid", referral_type: "external", bonus_amount: 5000, bonus_paid_date: new Date(), isBonusPayable: () => false },
      ];

      (Referral.findAll as jest.Mock).mockResolvedValue(mockReferrals);

      const result = await referralService.getReferralStats(mockOrgId);

      expect(result.total).toBe(5);
      expect(result.byStatus.pending).toBe(2);
      expect(result.byStatus.accepted).toBe(1);
      expect(result.byStatus.hired).toBe(1);
      expect(result.byStatus.bonus_paid).toBe(1);
    });

    it("should return zero stats for empty organization", async () => {
      (Referral.findAll as jest.Mock).mockResolvedValue([]);

      const result = await referralService.getReferralStats(mockOrgId);

      expect(result.total).toBe(0);
      expect(result.byStatus).toEqual({});
    });
  });

  describe("Multi-tenant isolation", () => {
    it("should only return referrals from the specified organization", async () => {
      const mockOrgId = "org-123";

      await referralService.listReferrals({}, {}, undefined, mockOrgId);

      expect(Referral.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organization_id: mockOrgId,
          }),
        })
      );
    });

    it("should prevent cross-organization referral approval", async () => {
      const mockReferral = {
        id: "ref-123",
        organization_id: "org-456",
        status: "pending",
      };

      (Referral.findOne as jest.Mock).mockResolvedValue(null);

      const result = await referralService.approveReferral(
        "ref-123",
        "user-123",
        "org-123"
      );

      expect(result).toBeNull();
    });
  });
});
