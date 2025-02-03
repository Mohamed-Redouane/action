import { errorMiddleware } from "../../middlewares/errorMiddleware.js";
import { Request, Response, NextFunction } from "express";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("errorMiddleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {} as Request;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as Partial<Response>;
    next = vi.fn();
  });

  it("should return 500 status code and generic error message when no status is provided", () => {
    const error = new Error("Something went wrong");

    errorMiddleware(error, req as Request, res as Response, next);

    expect((res.status as any)).toHaveBeenCalledWith(500);
    expect((res.json as any)).toHaveBeenCalledWith({
      message: "Something went wrong",
    });
  });

  it("should return custom status code and message if provided in the error object", () => {
    const error: any = { status: 400, message: "Bad Request" };

    errorMiddleware(error, req as Request, res as Response, next);

    expect((res.status as any)).toHaveBeenCalledWith(400);
    expect((res.json as any)).toHaveBeenCalledWith({
      message: "Bad Request",
    });
  });

  it("should include stack trace in development mode", () => {
    process.env.NODE_ENV = "development";
    const error = new Error("Dev Error");

    errorMiddleware(error, req as Request, res as Response, next);

    expect((res.status as any)).toHaveBeenCalledWith(500);
    expect((res.json as any)).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Dev Error",
        stack: expect.any(String),
      })
    );
  });

  it("should not include stack trace in production mode", () => {
    process.env.NODE_ENV = "production";
    const error = new Error("Prod Error");

    errorMiddleware(error, req as Request, res as Response, next);

    expect((res.status as any)).toHaveBeenCalledWith(500);
    expect((res.json as any)).toHaveBeenCalledWith({
      message: "Prod Error",
    });
  });
});
