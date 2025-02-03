// src/middlewares/sessionMiddleware.ts

import { Request, Response, NextFunction } from "express";

/**
 * Middleware to manage session cookies and CSRF protection
 */
export function sessionCookieMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.method === "GET") {
    // If there's a "session" cookie, extend its expiration
    const token = req.cookies["session"] ?? null;
    if (token) {
      // Reset the cookie with updated expiration
      res.cookie("session", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30 * 1000 // 30 days in milliseconds
      });
    }
  } else {
    // For non-GET requests, perform origin check to prevent CSRF
    const originHeader = req.headers.origin;
    const hostHeader = req.headers.host;
    if (!originHeader || !hostHeader) {
      res.status(403).send("Forbidden");
      return;
    }
    // Compare the host from origin vs host header. Adjust if behind proxy
    try {
      const url = new URL(originHeader);
      if (url.host !== hostHeader) {
        res.status(403).send("Forbidden");
        return;
      }
    } catch {
      res.status(403).send("Forbidden");
      return;
    }
  }
  next();
}
