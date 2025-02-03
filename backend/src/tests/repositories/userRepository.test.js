import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { Pool } from "pg";
import { UserRepository } from "../../repositories/userRepository";

// Mock the pg module
vi.mock("pg", () => {
  const mockPool = {
    query: vi.fn(),
  };
  return { Pool: vi.fn(() => mockPool) };
});

describe("UserRepository", () => {
  let pool;
  let userRepository;

  beforeAll(() => {
    pool = new Pool();
    userRepository = new UserRepository(pool);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user and return the user object", async () => {
      pool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            id: 1,
            email: "test@example.com",
            username: "testuser",
            email_verified: false,
          },
        ],
      });

      const dto = {
        email: "test@example.com",
        username: "testuser",
        password: "securepassword",
      };

      const result = await userRepository.createUser(dto, "hashedpassword");

      expect(result).toEqual({
        id: 1,
        email: "test@example.com",
        username: "testuser",
        emailVerified: false,
      });
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO"),
        [dto.email, dto.username, "hashedpassword", false]
      );
    });

    it("should throw an error if no rows are returned", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      const dto = {
        email: "test@example.com",
        username: "testuser",
        password: "securepassword",
      };

      await expect(
        userRepository.createUser(dto, "hashedpassword")
      ).rejects.toThrow("An error occurred while creating the user");
    });

    it("should handle unique constraint violation for email", async () => {
      pool.query.mockRejectedValueOnce({
        code: "23505",
        detail: "Key (email)=(test@example.com) already exists.",
      });

      const dto = {
        email: "test@example.com",
        username: "testuser",
        password: "securepassword",
      };

      await expect(
        userRepository.createUser(dto, "hashedpassword")
      ).rejects.toThrow("Email already exists");
    });

    it("should handle unique constraint violation for username", async () => {
      pool.query.mockRejectedValueOnce({
        code: "23505",
        detail: "Key (username)=(testuser) already exists.",
      });

      const dto = {
        email: "test@example.com",
        username: "testuser",
        password: "securepassword",
      };

      await expect(
        userRepository.createUser(dto, "hashedpassword")
      ).rejects.toThrow("Username already exists");
    });
  });

  describe("getUserPasswordHash", () => {
    it("should return the password hash for a valid user ID", async () => {
      pool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ password_hash: "hashedpassword" }],
      });

      const result = await userRepository.getUserPasswordHash(1);

      expect(result).toBe("hashedpassword");
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT password_hash"),
        [1]
      );
    });

    it("should throw an error for an invalid user ID", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      await expect(userRepository.getUserPasswordHash(1)).rejects.toThrow(
        "Invalid user ID"
      );
    });
  });

  describe("findByEmail", () => {
    it("should return a user object if email is found", async () => {
      pool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            id: 1,
            email: "test@example.com",
            username: "testuser",
            email_verified: false,
          },
        ],
      });

      const result = await userRepository.findByEmail("test@example.com");

      expect(result).toEqual({
        id: 1,
        email: "test@example.com",
        username: "testuser",
        emailVerified: false,
      });
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT id, email"),
        ["test@example.com"]
      );
    });

    it("should return null if email is not found", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      const result = await userRepository.findByEmail("unknown@example.com");

      expect(result).toBeNull();
    });
  });

  describe("setUserAsEmailVerified", () => {
    it("should update the email_verified field for the user", async () => {
      pool.query.mockResolvedValueOnce({});

      await userRepository.setUserAsEmailVerified(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE"),
        [1]
      );
    });
  });

  describe("updatePasswordHash", () => {
    it("should update the password hash for the user", async () => {
      pool.query.mockResolvedValueOnce({});

      await userRepository.updatePasswordHash(1, "newhashedpassword");

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE"),
        ["newhashedpassword", 1]
      );
    });
  });

  describe("findById", () => {
    it("should return a user object for a valid user ID", async () => {
      pool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            id: 1,
            email: "test@example.com",
            username: "testuser",
            email_verified: false,
          },
        ],
      });

      const result = await userRepository.findById(1);

      expect(result).toEqual({
        id: 1,
        email: "test@example.com",
        username: "testuser",
        emailVerified: false,
      });
    });

    it("should return null for an invalid user ID", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

      const result = await userRepository.findById(999);

      expect(result).toBeNull();
    });
  });
});
