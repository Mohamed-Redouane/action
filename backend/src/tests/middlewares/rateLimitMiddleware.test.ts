import request from "supertest";
import express from "express";
import { describe, it, expect, beforeEach } from "vitest";
import {
  loginRateLimiter,
  registerRateLimiter,
  passwordResetRateLimiter,
} from "../../middlewares/rateLimitMiddleware.js";

describe("Rate Limit Middleware", () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();
    app.use(
      "/login",
      loginRateLimiter,
      (req, res) => {
        res.status(200).json({ message: "Login Success" });
      }
    );
    app.use(
      "/register",
      registerRateLimiter,
      (req, res) => {
        res.status(200).json({ message: "Registration Success" });
      }
    );
    app.use(
      "/password-reset",
      passwordResetRateLimiter,
      (req, res) => {
        res.status(200).json({ message: "Password Reset Success" });
      }
    );
  });

  it("should allow up to 10 login attempts before rate limiting", async () => {
    for (let i = 0; i < 10; i++) {
      const res = await request(app).post("/login");
      expect(res.status).toBe(200);
    }

    const rateLimitedRes = await request(app).post("/login");
    expect(rateLimitedRes.status).toBe(429);
    expect(rateLimitedRes.body).toEqual({
      error: "Too many login attempts. Please try again in 10 minutes.",
    });
  });

  it("should allow up to 5 registration attempts before rate limiting", async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).post("/register");
      expect(res.status).toBe(200);
    }

    const rateLimitedRes = await request(app).post("/register");
    expect(rateLimitedRes.status).toBe(429);
    expect(rateLimitedRes.body).toEqual({
      error: "Too many registration attempts. Please try again in 10 minutes.",
    });
  });

  it("should allow up to 3 password reset requests before rate limiting", async () => {
    for (let i = 0; i < 3; i++) {
      const res = await request(app).post("/password-reset");
      expect(res.status).toBe(200);
    }

    const rateLimitedRes = await request(app).post("/password-reset");
    expect(rateLimitedRes.status).toBe(429);
    expect(rateLimitedRes.body).toEqual({
      error: "Too many password reset requests. Please try again in 30 minutes.",
    });
  });
});
