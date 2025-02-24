/// <reference types="vitest" />

import { vi } from "vitest";
vi.mock("../../container.js", () => ({
  container: {
    authService: {},
    sessionRepository: {},
    userRepository: {},
  },
}));


import { createRequest, createResponse } from "node-mocks-http";
import { describe, expect, test, beforeEach } from "vitest";
import { AuthController } from "../../controllers/authController.js"; 
import { container } from "../../container.js";
import * as sessionService from "../../services/sessionService.js";

beforeEach(() => {
  container.authService = <any>{
    register: vi.fn(),
    login: vi.fn(),
    verifyEmailByCode: vi.fn(),
    requestPasswordReset: vi.fn(),
    resetPassword: vi.fn(),
    resendVerification: vi.fn(),
  };

  container.sessionRepository = <any>{
    deleteById: vi.fn(),
    findById: vi.fn(),
  };

  container.userRepository = <any>{
    findById: vi.fn(),
  };


  vi.spyOn(sessionService, "setSessionCookie").mockImplementation((res, token) => {
    (res as any).sessionToken = token;
  });
  vi.spyOn(sessionService, "clearSessionCookie").mockImplementation((res) => {});
});

describe("AuthController", () => {
  let authController: AuthController;

  beforeEach(() => {

    authController = new AuthController();
  });

  test("register should respond with 201 and user on success", async () => {
    const req = createRequest({
      body: { email: "test@example.com", username: "testuser", password: "secret" },
    });
    const res = createResponse();

    const dummyUser = { id: "1", email: "test@example.com", username: "testuser" };
    (<any>container.authService).register.mockResolvedValue(dummyUser);

    await authController.register(req, res);
    expect(res.statusCode).toBe(201);
    const data = res._getJSONData();
    expect(data).toHaveProperty("message", "Registration successful. Check console for verification code.");
    expect(data).toHaveProperty("user", dummyUser);
  });

  test("login should respond with 200 and user on success", async () => {
    const req = createRequest({
      body: { email: "test@example.com", password: "secret" },
    });
    const res = createResponse();

    const dummyUser = { id: "1", email: "test@example.com" };
    const sessionToken = "dummy-token";
    (<any>container.authService).login.mockResolvedValue({ user: dummyUser, sessionToken });

    await authController.login(req, res);
    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty("message", "Login successful");
    expect(data).toHaveProperty("user", dummyUser);
    expect((res as any).sessionToken).toBe(sessionToken);
  });

  test("logout should respond with 200 and message on success", async () => {
    const req = createRequest({
      cookies: { session: "dummy-token" },
    });
    const res = createResponse();

    await authController.logout(req, res);
    expect((<any>container.sessionRepository).deleteById).toHaveBeenCalledWith("dummy-token");
    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty("message", "Logged out");
  });

  test("verifyEmail should respond with 200 on valid input", async () => {
    const req = createRequest({
      body: { userId: "1", code: "1234" },
    });
    const res = createResponse();

    (<any>container.authService).verifyEmailByCode.mockResolvedValue(undefined);
    await authController.verifyEmail(req, res);
    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty("message", "Email verified successfully");
  });

  test("verifyEmail should respond with 400 if userId or code missing", async () => {
    const req = createRequest({
      body: { userId: "1" }, 
    });
    const res = createResponse();

    await authController.verifyEmail(req, res);
    expect(res.statusCode).toBe(400);
    const data = res._getJSONData();
    expect(data).toHaveProperty("error", "Must provide userId and verification code.");
  });

  test("requestPasswordReset should respond with 200 on valid email", async () => {
    const req = createRequest({
      body: { email: "test@example.com" },
    });
    const res = createResponse();

    (<any>container.authService).requestPasswordReset.mockResolvedValue(undefined);
    await authController.requestPasswordReset(req, res);
    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty("message", "Reset requested. Check logs/email for code.");
  });

  test("requestPasswordReset should respond with 400 if email missing", async () => {
    const req = createRequest({ body: {} });
    const res = createResponse();

    await authController.requestPasswordReset(req, res);
    expect(res.statusCode).toBe(400);
    const data = res._getJSONData();
    expect(data).toHaveProperty("error", "Email is required.");
  });

  test("resetPassword should respond with 200 on valid input", async () => {
    const req = createRequest({
      body: { code: "1234", newPassword: "newsecret" },
    });
    const res = createResponse();

    (<any>container.authService).resetPassword.mockResolvedValue(undefined);
    await authController.resetPassword(req, res);
    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty("message", "Password reset successful.");
  });

  test("resetPassword should respond with 400 if code or newPassword missing", async () => {
    const req = createRequest({
      body: { code: "1234" },
    });
    const res = createResponse();

    await authController.resetPassword(req, res);
    expect(res.statusCode).toBe(400);
    const data = res._getJSONData();
    expect(data).toHaveProperty("error", "code and newPassword are required.");
  });

  test("resendVerification should respond with 200 on valid input", async () => {
    const req = createRequest({
      body: { userId: "1" },
    });
    const res = createResponse();

    (<any>container.authService).resendVerification.mockResolvedValue(undefined);
    await authController.resendVerification(req, res);
    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(data).toHaveProperty("message", "New verification code sent. Check console or email.");
  });

  test("resendVerification should respond with 400 if userId missing", async () => {
    const req = createRequest({
      body: {},
    });
    const res = createResponse();

    await authController.resendVerification(req, res);
    expect(res.statusCode).toBe(400);
    const data = res._getJSONData();
    expect(data).toHaveProperty("error", "userId is required.");
  });

  describe("me", () => {
    test("should respond with 401 if no session token provided", async () => {
      const req = createRequest({
        cookies: {},
      });
      const res = createResponse();

      await authController.me(req, res);
      expect(res.statusCode).toBe(401);
      const data = res._getJSONData();
      expect(data).toHaveProperty("error", "No session token provided");
    });

    test("should respond with 401 if session not found", async () => {
      const req = createRequest({
        cookies: { session: "dummy" },
      });
      const res = createResponse();

      (<any>container.sessionRepository).findById.mockResolvedValue(null);

      await authController.me(req, res);
      expect(res.statusCode).toBe(401);
      const data = res._getJSONData();
      expect(data).toHaveProperty("error", "Invalid session token");
    });

    test("should respond with 401 if session expired", async () => {
      const req = createRequest({
        cookies: { session: "dummy" },
      });
      const res = createResponse();

      (<any>container.sessionRepository).findById.mockResolvedValue({
        expiresAt: Math.floor(Date.now() / 1000) - 10,
        userId: "1",
      });

      await authController.me(req, res);
      expect((<any>container.sessionRepository).deleteById).toHaveBeenCalledWith("dummy");
      expect(res.statusCode).toBe(401);
      const data = res._getJSONData();
      expect(data).toHaveProperty("error", "Session expired");
    });

    test("should respond with 404 if user not found", async () => {
      const req = createRequest({
        cookies: { session: "dummy" },
      });
      const res = createResponse();

      // Valid session (not expired)
      (<any>container.sessionRepository).findById.mockResolvedValue({
        expiresAt: Math.floor(Date.now() / 1000) + 1000,
        userId: "1",
      });
      (<any>container.userRepository).findById.mockResolvedValue(null);

      await authController.me(req, res);
      expect(res.statusCode).toBe(404);
      const data = res._getJSONData();
      expect(data).toHaveProperty("error", "User not found");
    });

    test("should respond with 200 and user if valid session", async () => {
      const req = createRequest({
        cookies: { session: "dummy" },
      });
      const res = createResponse();

      const dummySession = {
        expiresAt: Math.floor(Date.now() / 1000) + 1000,
        userId: "1",
      };
      (<any>container.sessionRepository).findById.mockResolvedValue(dummySession);

      const dummyUser = { id: "1", email: "test@example.com" };
      (<any>container.userRepository).findById.mockResolvedValue(dummyUser);

      await authController.me(req, res);
      expect(res.statusCode).toBe(200);
      const data = res._getJSONData();
      expect(data).toHaveProperty("user", dummyUser);
    });
  });
});
