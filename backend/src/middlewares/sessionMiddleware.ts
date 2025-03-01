import { Request, Response, NextFunction } from "express";

const ALLOWED_ORIGINS = ["http://localhost:5173", "https://action-production.up.railway.app"];

export function sessionCookieMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.path === "/" || req.path === "/health") {
    return next();
  }

  if (req.method === "GET") {
    const token = req.cookies["session"] ?? null;
    if (token) {
      res.cookie("session", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30 * 1000, 
      });
    }
  } else {
    const originHeader = req.headers.origin;
    if (!originHeader || !ALLOWED_ORIGINS.includes(originHeader)) {
      res.status(403).json({ error: "Forbidden: CORS policy violation" });
      return;
    }

    // allow different host headers in development
    const hostHeader = req.headers.host;
    if (process.env.NODE_ENV === "production") {
      try {
        const url = new URL(originHeader);
        if (url.host !== hostHeader) {
          res.status(403).json({ error: "Forbidden: Host mismatch" });
          return;
        }
      } catch {
        res.status(403).json({ error: "Forbidden: Invalid origin" });
        return;
      }
    }
  }

  next(); 
}