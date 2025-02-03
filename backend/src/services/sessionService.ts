import { Response } from "express";

const SESSION_COOKIE_NAME = "session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS
  });
}

export function clearSessionCookie(res: Response) {
  res.cookie(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}
