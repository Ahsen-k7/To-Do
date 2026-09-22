import { Router } from "express";
import * as auth from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/require-auth.js";
import { authRateLimit, protectAuthRequests } from "../middleware/auth-security.js";

const router = Router();
router.use(protectAuthRequests);
router.post("/register", authRateLimit, auth.register);
router.post("/login", authRateLimit, auth.login);
router.get("/me", requireAuth, auth.me);
router.post("/logout", auth.logout);

export default router;
