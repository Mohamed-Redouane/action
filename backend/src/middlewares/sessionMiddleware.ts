import { Request, Response, NextFunction } from "express";

const ALLOWED_ORIGINS = ["http://localhost:5173"];

export function sessionCookieMiddleware(req: Request, res: Response, next: NextFunction): void {
  console.log("Request Path:", req.path);
  console.log("Request Method:", req.method);
  console.log("Origin Header:", req.headers.origin);
  console.log("Host Header:", req.headers.host);

  if (req.path === "/" || req.path === "/health") {
    console.log("Skipping middleware for:", req.path);
    return next();
  }

  if (req.method === "GET") {
    const token = req.cookies["session"] ?? null;
    console.log("Session Cookie Token:", token);
    if (token) {
      res.cookie("session", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30 * 1000, 
      });
      console.log("Session cookie refreshed.");
    }
  } else {
    const originHeader = req.headers.origin;
    if (!originHeader || !ALLOWED_ORIGINS.includes(originHeader)) {
      console.error("CORS policy violation:", {
        originHeader,
        allowedOrigins: ALLOWED_ORIGINS,
      });
      res.status(403).json({ error: "Forbidden: CORS policy violation" });
      return;
    }

    // Allow different host headers in development
    const hostHeader = req.headers.host;
    if (process.env.NODE_ENV === "production") {
      try {
        const url = new URL(originHeader);
        if (url.host !== hostHeader) {
          console.error("Host mismatch:", { originHost: url.host, requestHost: hostHeader });
          res.status(403).json({ error: "Forbidden: Host mismatch" });
          return;
        }
      } catch {
        console.error("Invalid origin header:", originHeader);
        res.status(403).json({ error: "Forbidden: Invalid origin" });
        return;
      }
    } else {
      console.log("Host check skipped in development.");
    }
  }

  console.log("Middleware checks passed. Proceeding to the next middleware...");
  next(); // Proceed to the next middleware if all checks pass
}
