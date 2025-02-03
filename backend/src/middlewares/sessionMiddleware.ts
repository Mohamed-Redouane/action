
import { Request, Response, NextFunction } from "express";


export function sessionCookieMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.path === '/' || req.path === '/health') {
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
    const hostHeader = req.headers.host;
    if (!originHeader || !hostHeader) {
      res.status(403).send("Forbidden");
      return;
    }

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
