import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { HttpError } from "../lib/http-error.js";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof ZodError) {
    res.status(400).json({ success: false, message: "Invalid request data.", errors: error.issues.map(issue => ({ field: issue.path.join("."), message: issue.message })) });
    return;
  }
  if (error instanceof HttpError) {
    res.status(error.status).json({ success: false, message: error.message });
    return;
  }
  if (error?.type === "entity.parse.failed") {
    res.status(400).json({ success: false, message: "Invalid JSON body." });
    return;
  }
  if (error?.type === "entity.too.large") {
    res.status(413).json({ success: false, message: "Request body is too large." });
    return;
  }
  console.error("Unexpected API error.");
  res.status(500).json({ success: false, message: "An unexpected error occurred." });
};
