import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { describe, expect, test, beforeAll, vi } from "vitest";
import "express";

declare global {
  namespace Express {
    interface Request {
      session?: any;
    }
  }
}


vi.mock("../../middlewares/rateLimitMiddleware.js", () => ({
  loginRateLimiter: (req: Request, res: Response, next: NextFunction): void => next(),
  passwordResetRateLimiter: (req: Request, res: Response, next: NextFunction): void => next(),
  registerRateLimiter: (req: Request, res: Response, next: NextFunction): void => next(),
}));


import { container } from "../../container.js";

const mockAuthController = {
  register: vi.fn(async (req: Request, res: Response): Promise<void> => {
    res.status(201).send("Registered");
  }),
  login: vi.fn(async (req: Request, res: Response): Promise<void> => {
    res.status(200).send("Logged in");
  }),
  logout: vi.fn(async (req: Request, res: Response): Promise<void> => {
    res.status(200).send("Logged out");
  }),
  verifyEmail: vi.fn(async (req: Request, res: Response): Promise<void> => {
    res.status(200).send("Email verified");
  }),
  requestPasswordReset: vi.fn(async (req: Request, res: Response): Promise<void> => {
    res.status(200).send("Password reset requested");
  }),
  resetPassword: vi.fn(async (req: Request, res: Response): Promise<void> => {
    res.status(200).send("Password reset");
  }),
  resendVerification: vi.fn(async (req: Request, res: Response): Promise<void> => {
    res.status(200).send("Verification resent");
  }),
  me: vi.fn(async (req: Request, res: Response): Promise<void> => {
    res.status(200).send("User data");
  }),
};

container.authController = mockAuthController;

let app: express.Application;

beforeAll(async () => {

  const { default: router } = await import("../../routes/authRoutes.js");

  app = express();
  app.use(express.json());

  
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.session = {} as any; 
    next();
  });

  app.use("/", router);
});

describe("Auth Routes", () => {
  test("POST /register should call register controller", async () => {
    const response = await request(app)
      .post("/register")
      .send({ email: "test@example.com", password: "password123" });
    expect(response.status).toBe(201);
    expect(mockAuthController.register).toHaveBeenCalled();
  });

  test("POST /login should call login controller", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(response.status).toBe(200);
    expect(mockAuthController.login).toHaveBeenCalled();
  });

  test("POST /logout should call logout controller", async () => {
    const response = await request(app).post("/logout");
    expect(response.status).toBe(200);
    expect(mockAuthController.logout).toHaveBeenCalled();
  });

  test("POST /verify-email should call verifyEmail controller", async () => {
    const response = await request(app)
      .post("/verify-email")
      .send({ token: "test-token" });
    expect(response.status).toBe(200);
    expect(mockAuthController.verifyEmail).toHaveBeenCalled();
  });

  test("POST /request-password-reset should call requestPasswordReset controller", async () => {
    const response = await request(app)
      .post("/request-password-reset")
      .send({ email: "test@example.com" });
    expect(response.status).toBe(200);
    expect(mockAuthController.requestPasswordReset).toHaveBeenCalled();
  });

  test("POST /reset-password should call resetPassword controller", async () => {
    const response = await request(app)
      .post("/reset-password")
      .send({ password: "newpassword123" });
    expect(response.status).toBe(200);
    expect(mockAuthController.resetPassword).toHaveBeenCalled();
  });

  test("POST /resend-verification should call resendVerification controller", async () => {
    const response = await request(app)
      .post("/resend-verification")
      .send({ email: "test@example.com" });
    expect(response.status).toBe(200);
    expect(mockAuthController.resendVerification).toHaveBeenCalled();
  });

  test("GET /me should call me controller", async () => {
    const response = await request(app).get("/me");
    expect(response.status).toBe(200);
    expect(mockAuthController.me).toHaveBeenCalled();
  });
});
