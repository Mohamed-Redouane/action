import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { Pool } from "pg";
import { PasswordResetRepository } from "../../repositories/passwordResetRepository";

vi.mock("pg", () => {
  const mockClient = {
    query: vi.fn(),
  };
  return { 
    Pool: vi.fn(() => ({ 
      connect: vi.fn(() => mockClient), 
      query: mockClient.query 
    })) 
  };
});

describe("PasswordResetRepository", () => {
  let pool;
  let passwordResetRepository;

  beforeAll(() => {
    pool = new Pool();
    passwordResetRepository = new PasswordResetRepository(pool);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createRequest", () => {
    it("should create a password reset request", async () => {
      const mockRequest = {
        userId: 1,
        email: "test@example.com",
        code: "123456",
        expiresAt: 1738463513,
        emailVerified: 0,
      };

      pool.query.mockResolvedValue({});

      await passwordResetRepository.createRequest(mockRequest);

      expect(pool.query).toHaveBeenCalledWith(
        `
      INSERT INTO "password_reset_session" (id, user_id, email, code, expires_at, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
        [
          mockRequest.code,
          mockRequest.userId,
          mockRequest.email,
          mockRequest.code,
          mockRequest.expiresAt,
          mockRequest.emailVerified,
        ]
      );
    });
  });

  describe("findByCode", () => {
    it("should return a password reset request if found", async () => {
      const mockResponse = {
        id: "123456",
        user_id: 1,
        email: "test@example.com",
        code: "123456",
        expires_at: 1738463513,
        email_verified: 0,
      };

      pool.query.mockResolvedValue({
        rowCount: 1,
        rows: [mockResponse],
      });

      const result = await passwordResetRepository.findByCode("123456");

      expect(result).toEqual({
        id: "123456",
        userId: 1,
        email: "test@example.com",
        code: "123456",
        expiresAt: 1738463513,
        emailVerified: 0,
      });

      expect(pool.query).toHaveBeenCalledWith(
        `
      SELECT id, user_id, email, code, expires_at, email_verified
      FROM "password_reset_session"
      WHERE code = $1
    `,
        ["123456"]
      );
    });

    it("should return null if no request is found", async () => {
      pool.query.mockResolvedValue({
        rowCount: 0,
        rows: [],
      });

      const result = await passwordResetRepository.findByCode("123456");

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        `
      SELECT id, user_id, email, code, expires_at, email_verified
      FROM "password_reset_session"
      WHERE code = $1
    `,
        ["123456"]
      );
    });
  });

  describe("deleteById", () => {
    it("should delete a password reset request by ID", async () => {
      pool.query.mockResolvedValue({});

      await passwordResetRepository.deleteById("123456");

      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM "password_reset_session" WHERE id = $1`,
        ["123456"]
      );
    });
  });

  describe("deleteByUserId", () => {
    it("should delete all password reset requests for a user ID", async () => {
      pool.query.mockResolvedValue({});

      await passwordResetRepository.deleteByUserId(1);

      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM "password_reset_session" WHERE user_id = $1`,
        [1]
      );
    });
  });
});
