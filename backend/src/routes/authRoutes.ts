import { Router, Request, Response, NextFunction } from "express";
import { container } from "../container.js";
import { loginRateLimiter, passwordResetRateLimiter, registerRateLimiter } from "../middlewares/rateLimitMiddleware.js";

const { authController } = container;
const router = Router();

const asyncHandler = (
  fn: (req: Request, res: Response) => Promise<void>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res)).catch(next);
};

router.post("/register",registerRateLimiter ,asyncHandler(authController.register.bind(authController)));
router.post("/login", loginRateLimiter , asyncHandler(authController.login.bind(authController)));
router.post("/logout", asyncHandler(authController.logout.bind(authController)));
router.post("/verify-email", asyncHandler(authController.verifyEmail.bind(authController)));
router.post("/request-password-reset",passwordResetRateLimiter, asyncHandler(authController.requestPasswordReset.bind(authController)));
router.post("/reset-password", asyncHandler(authController.resetPassword.bind(authController)));
// optional
router.post("/resend-verification", asyncHandler(authController.resendVerification.bind(authController)));
router.get("/me", asyncHandler(authController.me.bind(authController)));

export default router;
