import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { Pool } from "pg";
import { EmailVerificationRepository } from "../../repositories/emailVerificationRepository.js";

// Mock pg (PostgreSQL)
vi.mock("pg", () => {
  const mockClient = {
    query: vi.fn(), // Mock query method
  };
  return { Pool: vi.fn(() => mockClient) };
});

describe("EmailVerificationRepository", () => {
  let pool: any;
  let emailVerificationRepository: EmailVerificationRepository;

  beforeAll(() => {
    pool = new Pool(); // Use mocked Pool
    emailVerificationRepository = new EmailVerificationRepository(pool);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createRequest", () => {
    it("should create an email verification request", async () => {
      const mockRequest = {
        userId: 1,
        email: "test@example.com",
        code: "123456",
        expiresAt: 1738463513,
      };

      pool.query.mockResolvedValueOnce({}); // Mock query's resolved value

      await emailVerificationRepository.createRequest(mockRequest);

      expect(pool.query).toHaveBeenCalledWith(
        `
      INSERT INTO email_verification_request (id, user_id, code, email, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
        [mockRequest.code, mockRequest.userId, mockRequest.code, mockRequest.email, mockRequest.expiresAt]
      );
    });
  });

  describe("findByUserIdAndCode", () => {
    it("should return an email verification request if found", async () => {
      const mockResponse = {
        id: "123456",
        user_id: 1,
        email: "test@example.com",
        code: "123456",
        expires_at: 1738463513,
      };

      pool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [mockResponse],
      });

      const result = await emailVerificationRepository.findByUserIdAndCode(1, "123456");

      expect(result).toEqual({
        id: "123456",
        userId: 1,
        email: "test@example.com",
        code: "123456",
        expiresAt: 1738463513,
      });

      expect(pool.query).toHaveBeenCalledWith(
        `
      SELECT id, user_id, code, email, expires_at
      FROM email_verification_request
      WHERE user_id = $1 AND code = $2
    `,
        [1, "123456"]
      );
    });
  });
});
