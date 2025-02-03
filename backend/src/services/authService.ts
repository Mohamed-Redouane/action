import { randomBytes } from "crypto";
import { UserRepository } from "../repositories/userRepository.js";
import { SessionRepository } from "../repositories/sessionRepository.js";
import { EmailVerificationRepository } from "../repositories/emailVerificationRepository.js";

import { RegisterDTO } from "../dto/registerDTO.js";
import { LoginDTO } from "../dto/loginDTO.js";
import { hashPassword, verifyPassword, verifyPasswordNotPwned } from "./passwordService.js";

import { verifyEmailInput } from "../utils/emailValidation.js";
import { PasswordResetRepository } from "../repositories/passwordResetRepository.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "./emailService.js";

export interface UserResponse {
  id: number;
  email: string;
  username: string;
  emailVerified: boolean;
}

export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private sessionRepo: SessionRepository,
    private verificationRepo: EmailVerificationRepository,
    private passwordResetRepo: PasswordResetRepository

  ) {}

  /**
   * Registers a new user:
   * 1) Validate email format (and check DB for existing email, if desired)
   * 2) Check password with HIBP
   * 3) Hash password
   * 4) Create user
   * 5) Generate + log a verification code
   */
  public async register(dto: RegisterDTO): Promise<UserResponse> {
    // 1) Validate email input
    //    This ensures it meets a basic pattern like foo@bar.com and is < 256 chars.
    if (!verifyEmailInput(dto.email)) {
      throw new Error("Invalid email format");
    }

   
    // 2) Check if password is pwned (HIBP)
    const safe = await verifyPasswordNotPwned(dto.password);
    if (!safe) {
      throw new Error("Password is compromised (pwned). Please choose another.");
    }

    // 3) Hash password
    const passwordHash = await hashPassword(dto.password);

    // 4) Create user in DB
    const user = await this.userRepo.createUser(dto, passwordHash);

    // 5) Generate + store a verification code
    const verificationCode = this.generateVerificationCode();
    const expiresAt = Math.floor((Date.now() + 1000 * 60 * 10) / 1000); // 10 mins from now
    await this.verificationRepo.createRequest({
      userId: user.id,
      email: user.email,
      code: verificationCode,
      expiresAt
    });

    // For demo: log the code (in production, send via email)
    await sendVerificationEmail(user.email, verificationCode, user.username);

    console.log(`🚀 [DEV] Verification code for ${user.email}: ${verificationCode}`);

    return this.buildUserResponse(user);
  }

  /**
   * Logs in a user:
   * 1) Find by email
   * 2) Compare password
   * 3) (Optional) check if email verified
   * 4) Create session in DB
   * 5) Return user + token
   */
  public async login(dto: LoginDTO): Promise<{ user: UserResponse; sessionToken: string }> {
    // 1) Find user
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new Error("User not found");
    }

    // 2) Retrieve stored password hash
    const passwordHash = await this.userRepo.getUserPasswordHash(user.id);

    // 3) Compare
    const match = await verifyPassword(passwordHash, dto.password);
    if (!match) {
      throw new Error("Invalid credentials");
    }

    // If you want to enforce verification before login:
    if (!user.emailVerified) {
      throw new Error("Email not verified");
    }

    // 4) Create session in DB
    const sessionToken = await this.createSessionForUser(user.id);

    // 5) Return user + token
    return {
      user: this.buildUserResponse(user),
      sessionToken
    };
  }

  /**
   * Verifies a user's email with a code
   */
  public async verifyEmailByCode(userId: number, code: string): Promise<void> {
    const request = await this.verificationRepo.findByUserIdAndCode(userId, code);
    if (!request) {
      throw new Error("Invalid or expired verification code");
    }

    // Mark user as verified
    await this.userRepo.setUserAsEmailVerified(userId);

    // Clean up the request so it can't be reused
    await this.verificationRepo.deleteRequestsByUserId(userId);
  }
  public async requestPasswordReset(email: string): Promise<void> {
    // 1) find user
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    // 2) generate a random code
    //    We can do 6-digit numeric or random hex. 
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // e.g. randomBytes(16).toString("hex") for a 32-char hex

    // 3) remove old requests, create a new one
    await this.passwordResetRepo.deleteByUserId(user.id);

    const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60; // 15 minutes from now
    await this.passwordResetRepo.createRequest({
      userId: user.id,
      email: user.email,
      code,
      expiresAt
    });

    // 4) log or email the code
    await sendPasswordResetEmail(email, code, user.username);

    console.log(`[DEV] Password reset code for ${user.email}: ${code}`);
  }

  /**
   * 1) Find the password_reset_session row by code
   * 2) Check if expired
   * 3) Validate new password, hash it, update user
   * 4) Delete that reset row
   */
  public async resetPassword(code: string, newPassword: string): Promise<void> {
    // 1) find row by code
    const request = await this.passwordResetRepo.findByCode(code);
    if (!request) {
      throw new Error("Invalid or expired reset code");
    }

    // 2) check expiry
    const nowSec = Math.floor(Date.now() / 1000);
    if (request.expiresAt < nowSec) {
      // token is expired
      await this.passwordResetRepo.deleteById(request.id);
      throw new Error("Reset code has expired");
    }

    // 3) check new password (pwn check), hash, update user
    const safe = await verifyPasswordNotPwned(newPassword);
    if (!safe) {
      throw new Error("New password is compromised (pwned). Please choose another.");
    }
    const hashed = await hashPassword(newPassword);
    await this.userRepo.updatePasswordHash(request.userId, hashed);

    // 4) remove the row so it can't be reused
    await this.passwordResetRepo.deleteById(request.id);
  }

  /**
   * Private helper: create a session token in DB for a given user
   */
  private async createSessionForUser(userId: number): Promise<string> {
    const token = randomBytes(16).toString("hex"); // 32-char hex
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days

    await this.sessionRepo.createSession({
      id: token,
      userId,
      expiresAt
    });

    return token;
  }

  /**
   * Private helper: generate a 6-digit numeric verification code
   */
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Private helper: build a user response object
   */
  private buildUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      emailVerified: !!user.emailVerified
    };
  }
  public async resendVerification(userId: number): Promise<void> {
    // 1) find user
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.emailVerified) {
      throw new Error("User is already verified");
    }

    // 2) generate new code
    const code = this.generateVerificationCode();
    const expiresAt = Math.floor((Date.now() + 1000 * 60 * 10) / 1000);
    // remove any old requests
    await this.verificationRepo.deleteRequestsByUserId(userId);
    await this.verificationRepo.createRequest({
      userId,
      email: user.email,
      code,
      expiresAt
    });

    // 3) log/ send email
    await sendVerificationEmail(user.email, code, user.username);

    console.log(`[DEV] New verification code for ${user.email}: ${code}`);
  }



}
