
import pool from "./config/db.js";
import { UserRepository } from "./repositories/userRepository.js";
import { SessionRepository } from "./repositories/sessionRepository.js";
import { EmailVerificationRepository } from "./repositories/emailVerificationRepository.js";
import { PasswordResetRepository } from "./repositories/passwordResetRepository.js";
import { AuthService } from "./services/authService.js";
import { AuthController } from "./controllers/authController.js";




// Repositories
const userRepository = new UserRepository(pool);
const sessionRepository = new SessionRepository(pool);
const emailVerificationRepository = new EmailVerificationRepository(pool);
const passwordResetRepository = new PasswordResetRepository(pool);

// Service
const authService = new AuthService(
  userRepository,
  sessionRepository,
  emailVerificationRepository,
  passwordResetRepository 
);

// Controller
const authController = new AuthController();

// Export them so other files can import 'container'
export const container = {
  userRepository,
  sessionRepository,
  emailVerificationRepository,
  passwordResetRepository,
  authService,
  authController
};
