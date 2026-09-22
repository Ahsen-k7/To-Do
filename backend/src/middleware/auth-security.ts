import "dotenv/config";
import type { RequestHandler } from "express";
import { rateLimit } from "express-rate-limit";
import { HttpError } from "../lib/http-error.js";

const frontendUrl = process.env.FRONTEND_URL;
if (!frontendUrl) throw new Error("FRONTEND_URL is required for authentication.");
const trustedOrigin = new URL(frontendUrl).origin;

export const protectAuthRequests: RequestHandler = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  // A custom header prevents HTML forms from making authenticated mutations.
  // Browser cross-origin requests must pass both this check and CORS preflight.
  if (req.get("X-TaskFlow-CSRF") !== "1" ||
      (req.get("Origin") !== undefined && req.get("Origin") !== trustedOrigin)) {
    throw new HttpError(403, "Request origin or CSRF header is invalid.");
  }
  next();
};

// In-memory limits suit this single-process learning app.
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Try again in 15 minutes." },
});
