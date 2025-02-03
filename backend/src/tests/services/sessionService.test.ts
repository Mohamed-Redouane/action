import { describe, it, expect, vi, beforeEach } from "vitest";
import { Response } from "express";
import { setSessionCookie, clearSessionCookie } from "../../services/sessionService.js"

describe("Session Cookie Utility", () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      cookie: vi.fn(),
    };
  });

  it("should set a session cookie with correct options", () => {
    const token = "testToken";
    const isProduction = process.env.NODE_ENV === "production";

    setSessionCookie(mockResponse as Response, token);

    expect(mockResponse.cookie).toHaveBeenCalledWith("session", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, 
    });
  });

  it("should clear a session cookie with correct options", () => {
    clearSessionCookie(mockResponse as Response);

    const isProduction = process.env.NODE_ENV === "production";
    expect(mockResponse.cookie).toHaveBeenCalledWith("session", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 0, 
    });
  });
});
