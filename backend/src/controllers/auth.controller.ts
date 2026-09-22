import type { RequestHandler } from "express";
import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../validators/auth.schema.js";
import { readSessionToken, SESSION_COOKIE, sessionCookieOptions, SESSION_DURATION_MS } from "../lib/session.js";

export const register: RequestHandler = async (req, res) => {
  const user = await authService.register(registerSchema.parse(req.body));
  res.status(201).json({ success: true, user });
};

export const login: RequestHandler = async (req, res) => {
  const { user, token, expiresAt } = await authService.login(loginSchema.parse(req.body), readSessionToken(req));
  res.cookie(SESSION_COOKIE, token, { ...sessionCookieOptions, maxAge: SESSION_DURATION_MS });
  res.json({ success: true, user, expiresAt });
};

export const me: RequestHandler = (req, res) => {
  res.json({ success: true, user: res.locals.user });
};

export const logout: RequestHandler = async (req, res) => {
  await authService.logout(readSessionToken(req));
  res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
  res.json({ success: true, message: "Logged out." });
};
