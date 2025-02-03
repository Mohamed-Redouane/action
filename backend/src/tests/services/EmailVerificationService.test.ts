import { describe, it, expect, beforeAll, afterEach, vi } from "vitest";
import { Pool } from "pg";
import { EmailVerificationService } from "../../services/EmailVerificationService.js";


const normalizeQuery = (query: string) => query.replace(/\s+/g, " ").trim();


vi.mock("pg", () => {
  const mockClient = { query: vi.fn() };
  return { Pool: vi.fn(() => mockClient) };
});

describe("EmailVerificationService", () => {
  let pool: any;
  let emailVerificationService: EmailVerificationService;

  beforeAll(() => {
    pool = new Pool();
    emailVerificationService = new EmailVerificationService(pool);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createRequest", () => {
    it("should create a new email verification request", async () => {
      const userId = 1;
      const email = "test@example.com";

      pool.query.mockResolvedValueOnce({ rowCount: 1 }); 
      pool.query.mockResolvedValueOnce({ rowCount: 1 }); 

      const result = await emailVerificationService.createRequest(userId, email);

      expect(pool.query).toHaveBeenCalledTimes(2);


      expect(normalizeQuery(pool.query.mock.calls[0][0])).toBe(
        normalizeQuery(`DELETE FROM email_verification_request WHERE user_id = $1`)
      );
      expect(pool.query.mock.calls[0][1]).toEqual([userId]);


      expect(normalizeQuery(pool.query.mock.calls[1][0])).toBe(
        normalizeQuery(
          `INSERT INTO email_verification_request (id, user_id, code, email, expires_at) 
          VALUES ($1, $2, $3, $4, $5)`
        )
      );
      const insertParams = pool.query.mock.calls[1][1];
      expect(insertParams[1]).toBe(userId);
      expect(insertParams[3]).toBe(email);
      expect(typeof insertParams[0]).toBe("string"); 
      expect(typeof insertParams[2]).toBe("string"); 
      expect(typeof insertParams[4]).toBe("number"); 

      expect(result).toMatchObject({
        userId,
        email,
        code: expect.any(String),
        expiresAt: expect.any(Number),
      });
    });
  });

  describe("getRequestById", () => {
    it("should return an email verification request if found", async () => {
      const mockRequestFromDb = {
        id: "random_id",
        user_id: 1,
        code: "123456",
        email: "test@example.com",
        expires_at: 1738463513,
      };

      pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [mockRequestFromDb] });

      const result = await emailVerificationService.getRequestById(mockRequestFromDb.id, mockRequestFromDb.user_id);

      expect(normalizeQuery(pool.query.mock.calls[0][0])).toBe(
        normalizeQuery(`SELECT id, user_id, code, email, expires_at FROM email_verification_request WHERE id = $1 AND user_id = $2`)
      );
      expect(pool.query.mock.calls[0][1]).toEqual([mockRequestFromDb.id, mockRequestFromDb.user_id]);

      expect(result).toEqual({
        id: "random_id",
        userId: 1,
        code: "123456",
        email: "test@example.com",
        expiresAt: 1738463513,
      });
    });

    it("should return null if no request is found", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      const result = await emailVerificationService.getRequestById("non_existent_id", 99);

      expect(normalizeQuery(pool.query.mock.calls[0][0])).toBe(
        normalizeQuery(`SELECT id, user_id, code, email, expires_at FROM email_verification_request WHERE id = $1 AND user_id = $2`)
      );
      expect(pool.query.mock.calls[0][1]).toEqual(["non_existent_id", 99]);
      expect(result).toBeNull();
    });
  });

  describe("deleteRequestByUserId", () => {
    it("should delete email verification request for a user", async () => {
      const userId = 1;
      pool.query.mockResolvedValueOnce({ rowCount: 1 });

      await emailVerificationService.deleteRequestByUserId(userId);

      expect(normalizeQuery(pool.query.mock.calls[0][0])).toBe(
        normalizeQuery(`DELETE FROM email_verification_request WHERE user_id = $1`)
      );
      expect(pool.query.mock.calls[0][1]).toEqual([userId]);
    });
  });

  describe("sendVerificationEmail", () => {
    it("should log verification email to the console", () => {
      const consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
      const email = "test@example.com";
      const code = "123456";

      emailVerificationService.sendVerificationEmail(email, code);

      expect(consoleLogMock).toHaveBeenCalledWith(
        `🚀 [DEV] To ${email}: your verification code is ${code}`
      );

      consoleLogMock.mockRestore();
    });
  });
});
