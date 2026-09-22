import type { CookieOptions, Request } from "express";
import { createHash } from "node:crypto";

export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
export const SESSION_COOKIE = "taskflow_session";
export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function readSessionToken(req: Request): string | undefined {
  const token: unknown = req.cookies?.[SESSION_COOKIE];
  return typeof token === "string" && /^[a-f0-9]{64}$/.test(token)
    ? token
    : undefined;
}
