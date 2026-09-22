import type { RequestHandler } from "express";
import { getSessionUser } from "../services/auth.service.js";
import { readSessionToken, SESSION_COOKIE, sessionCookieOptions } from "../lib/session.js";
import { HttpError } from "../lib/http-error.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
  const token = readSessionToken(req);
  const user = token ? await getSessionUser(token) : null;
  if (!user) {
    res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
    throw new HttpError(401, "Authentication required.");
  }
  res.locals.user = user;
  next();
};
