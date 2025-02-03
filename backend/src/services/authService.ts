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

  
  public async register(dto: RegisterDTO): Promise<UserResponse> {
    
    if (!verifyEmailInput(dto.email)) {
      throw new Error("Invalid email format");
    }

   
    const safe = await verifyPasswordNotPwned(dto.password);
    if (!safe) {
      throw new Error("Password is compromised (pwned). Please choose another.");
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await this.userRepo.createUser(dto, passwordHash);

    const verificationCode = this.generateVerificationCode();
    const expiresAt = Math.floor((Date.now() + 1000 * 60 * 10) / 1000); 
    await this.verificationRepo.createRequest({
      userId: user.id,
      email: user.email,
      code: verificationCode,
      expiresAt
    });
    await sendVerificationEmail(user.email, verificationCode, user.username);

    console.log(`🚀 [DEV] Verification code for ${user.email}: ${verificationCode}`);

    return this.buildUserResponse(user);
  }

 
  public async login(dto: LoginDTO): Promise<{ user: UserResponse; sessionToken: string }> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new Error("User not found");
    }

    const passwordHash = await this.userRepo.getUserPasswordHash(user.id);

    const match = await verifyPassword(passwordHash, dto.password);
    if (!match) {
      throw new Error("Invalid credentials");
    }

    if (!user.emailVerified) {
      throw new Error("Email not verified");
    }

    const sessionToken = await this.createSessionForUser(user.id);

    return {
      user: this.buildUserResponse(user),
      sessionToken
    };
  }

  
  public async verifyEmailByCode(userId: number, code: string): Promise<void> {
    const request = await this.verificationRepo.findByUserIdAndCode(userId, code);
    if (!request) {
      throw new Error("Invalid or expired verification code");
    }

    await this.userRepo.setUserAsEmailVerified(userId);

    await this.verificationRepo.deleteRequestsByUserId(userId);
  }
  public async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

  
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    await this.passwordResetRepo.deleteByUserId(user.id);

    const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60; 
    await this.passwordResetRepo.createRequest({
      userId: user.id,
      email: user.email,
      code,
      expiresAt
    });

    await sendPasswordResetEmail(email, code, user.username);

    console.log(`[DEV] Password reset code for ${user.email}: ${code}`);
  }

  public async resetPassword(code: string, newPassword: string): Promise<void> {

    const request = await this.passwordResetRepo.findByCode(code);
    if (!request) {
      throw new Error("Invalid or expired reset code");
    }

    const nowSec = Math.floor(Date.now() / 1000);
    if (request.expiresAt < nowSec) {

        await this.passwordResetRepo.deleteById(request.id);
      throw new Error("Reset code has expired");
    }

    const safe = await verifyPasswordNotPwned(newPassword);
    if (!safe) {
      throw new Error("New password is compromised (pwned). Please choose another.");
    }
    const hashed = await hashPassword(newPassword);
    await this.userRepo.updatePasswordHash(request.userId, hashed);

    await this.passwordResetRepo.deleteById(request.id);
  }

  
  private async createSessionForUser(userId: number): Promise<string> {
    const token = randomBytes(16).toString("hex"); 
    const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; 

    await this.sessionRepo.createSession({
      id: token,
      userId,
      expiresAt
    });

    return token;
  }

  
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  
  private buildUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      emailVerified: !!user.emailVerified
    };
  }
  public async resendVerification(userId: number): Promise<void> {

    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.emailVerified) {
      throw new Error("User is already verified");
    }

    const code = this.generateVerificationCode();
    const expiresAt = Math.floor((Date.now() + 1000 * 60 * 10) / 1000);

    await this.verificationRepo.deleteRequestsByUserId(userId);
    await this.verificationRepo.createRequest({
      userId,
      email: user.email,
      code,
      expiresAt
    });

    await sendVerificationEmail(user.email, code, user.username);

    console.log(`[DEV] New verification code for ${user.email}: ${code}`);
  }



}
