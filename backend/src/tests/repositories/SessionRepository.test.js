import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Pool } from "pg";
import { SessionRepository } from "../../repositories/sessionRepository";

// Mock the pg module
vi.mock("pg", () => {
  const mockClient = {
    query: vi.fn(),
    connect: vi.fn(),
    release: vi.fn(),
  };
  const mockPool = {
    query: vi.fn(),
    connect: vi.fn(() => mockClient),
  };
  return { Pool: vi.fn(() => mockPool) };
});

describe("SessionRepository", () => {
  let pool;
  let sessionRepository;

  beforeEach(() => {
    pool = new Pool();
    sessionRepository = new SessionRepository(pool);
    vi.clearAllMocks(); // Reset mocks before each test
  });

  describe("createSession", () => {
    it("should insert a session into the database", async () => {
      const session = {
        id: "session123",
        userId: 1,
        expiresAt: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      };

      await sessionRepository.createSession(session);

      expect(pool.query).toHaveBeenCalledWith(
        `
      INSERT INTO "session" (id, user_id, expires_at)
      VALUES ($1, $2, $3)
    `,
        [session.id, session.userId, session.expiresAt]
      );
    });
  });

  describe("findById", () => {
    it("should return a session if it exists", async () => {
      const session = {
        id: "session123",
        userId: 1,
        expiresAt: Math.floor(Date.now() / 1000) + 3600,
      };

      pool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            id: session.id,
            user_id: session.userId,
            expires_at: session.expiresAt,
          },
        ],
      });

      const result = await sessionRepository.findById(session.id);

      expect(result).toEqual(session);
      expect(pool.query).toHaveBeenCalledWith(
        `
      SELECT id, user_id, expires_at
      FROM "session"
      WHERE id = $1
    `,
        [session.id]
      );
    });

    it("should return null if the session does not exist", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      const result = await sessionRepository.findById("nonexistent123");

      expect(result).toBeNull();
      expect(pool.query).toHaveBeenCalledWith(
        `
      SELECT id, user_id, expires_at
      FROM "session"
      WHERE id = $1
    `,
        ["nonexistent123"]
      );
    });
  });

  describe("deleteById", () => {
    it("should delete a session by its ID", async () => {
      const sessionId = "session123";

      await sessionRepository.deleteById(sessionId);

      expect(pool.query).toHaveBeenCalledWith(
        `DELETE FROM "session" WHERE id = $1`,
        [sessionId]
      );
    });
  });
});
