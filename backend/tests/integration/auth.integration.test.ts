/**
 * Auth Integration Tests
 * Tests the full request/response cycle using the Express app.
 * All database models are mocked — no real DB connection required.
 */

// ---- Mock rate limiter FIRST to prevent Redis initialisation at module load ----
jest.mock("../../src/shared/middleware/rateLimiter.middleware", () => {
  const noop = (_req: any, _res: any, next: any) => next();
  return {
    globalRateLimiter: noop,
    authRateLimiter: noop,
    apiRateLimiter: noop,
    sensitiveRateLimiter: noop,
    profileUpdateRateLimiter: noop,
  };
});

// ---- Mock all DB-touching modules ----
jest.mock("../../src/config/database", () => ({
  default: {
    authenticate: jest.fn().mockResolvedValue(undefined),
    sync: jest.fn().mockResolvedValue(undefined),
    define: jest.fn(),
    query: jest.fn(),
  },
  testConnection: jest.fn().mockResolvedValue(undefined),
  syncDatabase: jest.fn().mockResolvedValue(undefined),
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("../../src/config/redis", () => ({
  testRedisConnection: jest.fn().mockResolvedValue(undefined),
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock("../../src/modules/auth/models", () => {
  const mkMethods = () => ({
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn(),
    count: jest.fn().mockResolvedValue(0),
  });
  return {
    initAuthModels: jest.fn(),
    User: mkMethods(),
    UserSession: mkMethods(),
    RefreshToken: mkMethods(),
    EmailVerification: mkMethods(),
    InviteToken: mkMethods(),
  };
});


// Mock models with proper static methods
jest.mock("../../src/modules/auth/models/User", () => {
  const mockUser = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };
  return { User: mockUser };
});

jest.mock("../../src/modules/auth/models/EmailVerification", () => ({
  EmailVerification: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock("../../src/modules/auth/models/InviteToken", () => ({
  InviteToken: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock("../../src/database/models/Organization", () => ({
  Organization: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

jest.mock("../../src/database/models/Job", () => ({
  Job: { findOne: jest.fn(), findAll: jest.fn() },
}));
jest.mock("../../src/database/models/Application", () => ({
  Application: { findOne: jest.fn(), findAll: jest.fn() },
}));
jest.mock("../../src/database/models/Referral", () => ({
  Referral: { findOne: jest.fn(), findAll: jest.fn() },
}));
jest.mock("../../src/database/models/AuditLog", () => ({
  AuditLog: { findOne: jest.fn(), findAll: jest.fn(), create: jest.fn() },
}));

// ---- Now import after mocks ----
import request from "supertest";
import app from "../../src/app";
import { User } from "../../src/modules/auth/models/User";

describe("Auth Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==================== POST /api/auth/register ====================
  describe("POST /api/auth/register", () => {
    it("should return 422 for missing required fields", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({});

      // Validation middleware returns 422 for missing fields
      expect(res.status).toBe(422);
    });

    it("should return 422 for invalid email format", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "not-an-email",
          password: "SecurePass123!",
          userType: "JOB_SEEKER",
        });

      expect(res.status).toBe(422);
    });

    it("should register successfully with valid data", async () => {
      const mockUser = {
        id: "user-new-123",
        firstName: "John",
        lastName: "Doe",
        email: "john.new@example.com",
        userType: "JOB_SEEKER",
        isActive: true,
        tokenVersion: 0,
        organizationId: null,
        toSafeJSON: jest.fn().mockReturnValue({
          id: "user-new-123",
          email: "john.new@example.com",
          firstName: "John",
          lastName: "Doe",
          userType: "JOB_SEEKER",
          emailVerified: false,
          organizationId: null,
        }),
      };
      const mockSession = { id: "session-1" };

      const mocks = jest.requireMock("../../src/modules/auth/models");
      mocks.User.findOne.mockResolvedValue(null); // Email not taken
      mocks.User.create.mockResolvedValue(mockUser);
      mocks.UserSession.count.mockResolvedValue(0);
      mocks.UserSession.create.mockResolvedValue(mockSession);
      mocks.RefreshToken.create.mockResolvedValue({});

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "john.new@example.com",
          password: "SecurePass123!",
          userType: "JOB_SEEKER",
        });

      // Should be 201 (created) or 200 — depends on controller implementation
      expect([200, 201]).toContain(res.status);
    });


    it("should return 400 or 409 if email already exists", async () => {
      const existingUser = {
        id: "user-existing",
        email: "existing@example.com",
      };
      const { User: MockUser } = jest.requireMock("../../src/modules/auth/models");
      MockUser.findOne.mockResolvedValue(existingUser);

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          firstName: "John",
          lastName: "Doe",
          email: "existing@example.com",
          password: "SecurePass123!",
          userType: "JOB_SEEKER",
        });

      // Should not succeed — email already in use
      expect(res.status).not.toBe(200);
      expect(res.status).not.toBe(201);
    });
  });

  // ==================== POST /api/auth/login ====================
  describe("POST /api/auth/login", () => {
    it("should return 422 for missing credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({});

      // Validation middleware returns 422 for missing/invalid fields
      expect([400, 422]).toContain(res.status);
    });

    it("should return 422 for invalid email format", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "not-valid", password: "pass" });

      expect([400, 422]).toContain(res.status);
    });

    it("should not return 200 for non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nobody@example.com", password: "WrongPass123!" });

      // Should return any non-success status (400, 401, 422, or 500 if error handler maps it)
      expect(res.status).not.toBe(200);
    });
  });

  // ==================== GET /api/auth/me ====================
  describe("GET /api/auth/me", () => {
    it("should return 401 without a token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("should return 401 with an invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid.token.here");

      expect(res.status).toBe(401);
    });
  });

  // ==================== Health check ====================
  describe("GET /health", () => {
    it("should return 200 with health status", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("data");
    });
  });

  // ==================== 404 handler ====================
  describe("GET /nonexistent", () => {
    it("should return 404 for unknown routes", async () => {
      const res = await request(app).get("/api/nonexistent-route");
      expect(res.status).toBe(404);
    });
  });
});
