
process.env.RESEND_API_KEY = 're_dummy_api_key';

import { describe, it, expect, beforeEach, vi } from "vitest";

import { AuthService } from "../../services/authService";

import { hashPassword, verifyPassword, verifyPasswordNotPwned } from "../../services/passwordService";
import { sendPasswordResetEmail, sendVerificationEmail } from "../../services/emailService";
import { verifyEmailInput } from "../../utils/emailValidation";

const mockUserRepo = {
  createUser: vi.fn(),
  findByEmail: vi.fn(),
  getUserPasswordHash: vi.fn(),
  updatePasswordHash: vi.fn(),
  setUserAsEmailVerified: vi.fn(),
  findById: vi.fn(),
};

const mockSessionRepo = {
  createSession: vi.fn(),
};

const mockVerificationRepo = {
  createRequest: vi.fn(),
  findByUserIdAndCode: vi.fn(),
  deleteRequestsByUserId: vi.fn(),
};

const mockPasswordResetRepo = {
  deleteByUserId: vi.fn(),
  createRequest: vi.fn(),
  findByCode: vi.fn(),
  deleteById: vi.fn(),
};

vi.mock("../../services/passwordService", () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
  verifyPasswordNotPwned: vi.fn(),
}));

vi.mock("../../services/emailService", () => ({
  sendVerificationEmail: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("../../utils/emailValidation", () => ({
  verifyEmailInput: vi.fn(),
}));

let authService;
beforeEach(() => {
  vi.clearAllMocks();
  authService = new AuthService(
    mockUserRepo,
    mockSessionRepo,
    mockVerificationRepo,
    mockPasswordResetRepo
  );
});

describe("AuthService.register", () => {
  it("should register a user successfully", async () => {
    const dto = {
      email: "test@example.com",
      username: "testuser",
      password: "StrongPassword123!",
    };

    verifyEmailInput.mockReturnValue(true);
    verifyPasswordNotPwned.mockResolvedValue(true);
    hashPassword.mockResolvedValue("hashedpassword");
    const createdUser = {
      id: 1,
      email: dto.email,
      username: dto.username,
      emailVerified: false,
    };
    mockUserRepo.createUser.mockResolvedValue(createdUser);
    mockVerificationRepo.createRequest.mockResolvedValue({ rowCount: 1 });
    sendVerificationEmail.mockResolvedValue();

    const response = await authService.register(dto);


    expect(verifyEmailInput).toHaveBeenCalledWith(dto.email);
    expect(verifyPasswordNotPwned).toHaveBeenCalledWith(dto.password);
    expect(hashPassword).toHaveBeenCalledWith(dto.password);
    expect(mockUserRepo.createUser).toHaveBeenCalledWith(dto, "hashedpassword");
    expect(mockVerificationRepo.createRequest).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalledWith(
      dto.email,
      expect.any(String),
      dto.username
    );
    expect(response).toEqual({
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
      emailVerified: false,
    });
  });

  it("should throw an error for invalid email", async () => {

    const dto = {
      email: "invalid-email",
      username: "testuser",
      password: "StrongPassword123!",
    };
    verifyEmailInput.mockReturnValue(false);


    await expect(authService.register(dto)).rejects.toThrow("Invalid email format");
  });

  it("should throw an error if the password is compromised", async () => {
    const dto = {
      email: "test@example.com",
      username: "testuser",
      password: "WeakPassword",
    };

    verifyEmailInput.mockReturnValue(true);
    verifyPasswordNotPwned.mockResolvedValue(false);

    await expect(authService.register(dto)).rejects.toThrow(
      "Password is compromised (pwned). Please choose another."
    );
  });
});

describe("AuthService.login", () => {
  it("should log in a user successfully", async () => {

    const dto = {
      email: "test@example.com",
      password: "StrongPassword123!",
    };

    const user = {
      id: 1,
      email: dto.email,
      username: "testuser",
      emailVerified: true,
    };
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockUserRepo.getUserPasswordHash.mockResolvedValue("hashedpassword");
    verifyPassword.mockResolvedValue(true);

    
    mockSessionRepo.createSession.mockResolvedValue();

    const { user: userResponse, sessionToken } = await authService.login(dto);

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(mockUserRepo.getUserPasswordHash).toHaveBeenCalledWith(user.id);
    expect(verifyPassword).toHaveBeenCalledWith("hashedpassword", dto.password);
    expect(mockSessionRepo.createSession).toHaveBeenCalled();
    expect(userResponse).toEqual({
      id: user.id,
      email: user.email,
      username: user.username,
      emailVerified: true,
    });
    expect(typeof sessionToken).toBe("string");
  });

  it("should throw an error if user is not found", async () => {
    const dto = {
      email: "notfound@example.com",
      password: "anything",
    };
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(authService.login(dto)).rejects.toThrow("User not found");
  });

  it("should throw an error if password does not match", async () => {
    const dto = {
      email: "test@example.com",
      password: "WrongPassword",
    };

    const user = {
      id: 1,
      email: dto.email,
      username: "testuser",
      emailVerified: true,
    };
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockUserRepo.getUserPasswordHash.mockResolvedValue("hashedpassword");
    verifyPassword.mockResolvedValue(false);

    await expect(authService.login(dto)).rejects.toThrow("Invalid credentials");
  });

  it("should throw an error if email is not verified", async () => {
    const dto = {
      email: "test@example.com",
      password: "StrongPassword123!",
    };

    const user = {
      id: 1,
      email: dto.email,
      username: "testuser",
      emailVerified: false,
    };
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockUserRepo.getUserPasswordHash.mockResolvedValue("hashedpassword");
    verifyPassword.mockResolvedValue(true);

    await expect(authService.login(dto)).rejects.toThrow("Email not verified");
  });
});

describe("AuthService.verifyEmailByCode", () => {
  it("should verify email when code is valid", async () => {
    // Arrange
    const userId = 1;
    const code = "123456";
    const verificationRequest = { id: "req1" };
    mockVerificationRepo.findByUserIdAndCode.mockResolvedValue(verificationRequest);

    // Act
    await authService.verifyEmailByCode(userId, code);

    // Assert
    expect(mockVerificationRepo.findByUserIdAndCode).toHaveBeenCalledWith(userId, code);
    expect(mockUserRepo.setUserAsEmailVerified).toHaveBeenCalledWith(userId);
    expect(mockVerificationRepo.deleteRequestsByUserId).toHaveBeenCalledWith(userId);
  });

  it("should throw an error if verification request is not found", async () => {
    const userId = 1;
    const code = "wrong";
    mockVerificationRepo.findByUserIdAndCode.mockResolvedValue(null);

    await expect(authService.verifyEmailByCode(userId, code)).rejects.toThrow(
      "Invalid or expired verification code"
    );
  });
});

describe("AuthService.requestPasswordReset", () => {
  it("should request a password reset successfully", async () => {
    const email = "test@example.com";
    const user = {
      id: 1,
      email,
      username: "testuser",
      emailVerified: true,
    };
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockPasswordResetRepo.deleteByUserId.mockResolvedValue();
    mockPasswordResetRepo.createRequest.mockResolvedValue();
    sendPasswordResetEmail.mockResolvedValue();

    await authService.requestPasswordReset(email);

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email);
    expect(mockPasswordResetRepo.deleteByUserId).toHaveBeenCalledWith(user.id);
    expect(mockPasswordResetRepo.createRequest).toHaveBeenCalled();
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(email, expect.any(String), user.username);
  });

  it("should throw an error if user is not found", async () => {
    const email = "nonexistent@example.com";
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(authService.requestPasswordReset(email)).rejects.toThrow("User not found");
  });
});

describe("AuthService.resetPassword", () => {
  it("should reset the password successfully", async () => {
    const code = "123456";
    const newPassword = "NewStrongPassword123!";

    const resetRequest = {
      id: "reset1",
      userId: 1,
      expiresAt: Math.floor(Date.now() / 1000) + 60, 
    };
    mockPasswordResetRepo.findByCode.mockResolvedValue(resetRequest);

    verifyPasswordNotPwned.mockResolvedValue(true);
    hashPassword.mockResolvedValue("newhashedpassword");

    await authService.resetPassword(code, newPassword);

    expect(mockPasswordResetRepo.findByCode).toHaveBeenCalledWith(code);
    expect(verifyPasswordNotPwned).toHaveBeenCalledWith(newPassword);
    expect(hashPassword).toHaveBeenCalledWith(newPassword);
    expect(mockUserRepo.updatePasswordHash).toHaveBeenCalledWith(resetRequest.userId, "newhashedpassword");
    expect(mockPasswordResetRepo.deleteById).toHaveBeenCalledWith(resetRequest.id);
  });

  it("should throw an error if reset code is invalid", async () => {
    const code = "invalid";
    mockPasswordResetRepo.findByCode.mockResolvedValue(null);

    await expect(authService.resetPassword(code, "anything")).rejects.toThrow(
      "Invalid or expired reset code"
    );
  });

  it("should throw an error if reset code has expired", async () => {
    const code = "expired";
    const resetRequest = {
      id: "reset_expired",
      userId: 1,
      expiresAt: Math.floor(Date.now() / 1000) - 10, 
    };
    mockPasswordResetRepo.findByCode.mockResolvedValue(resetRequest);

    await expect(authService.resetPassword(code, "anything")).rejects.toThrow(
      "Reset code has expired"
    );
    expect(mockPasswordResetRepo.deleteById).toHaveBeenCalledWith(resetRequest.id);
  });

  it("should throw an error if new password is compromised", async () => {
    const code = "123456";
    const newPassword = "CompromisedPassword";
    const resetRequest = {
      id: "reset1",
      userId: 1,
      expiresAt: Math.floor(Date.now() / 1000) + 60,
    };
    mockPasswordResetRepo.findByCode.mockResolvedValue(resetRequest);
    verifyPasswordNotPwned.mockResolvedValue(false);

    await expect(authService.resetPassword(code, newPassword)).rejects.toThrow(
      "New password is compromised (pwned). Please choose another."
    );
  });
});

describe("AuthService.resendVerification", () => {
  it("should resend verification code successfully", async () => {
    const userId = 1;
    const user = {
      id: userId,
      email: "test@example.com",
      username: "testuser",
      emailVerified: false,
    };
    mockUserRepo.findById.mockResolvedValue(user);
    mockVerificationRepo.deleteRequestsByUserId.mockResolvedValue();
    mockVerificationRepo.createRequest.mockResolvedValue();
    sendVerificationEmail.mockResolvedValue();

    await authService.resendVerification(userId);

    expect(mockUserRepo.findById).toHaveBeenCalledWith(userId);
    expect(mockVerificationRepo.deleteRequestsByUserId).toHaveBeenCalledWith(userId);
    expect(mockVerificationRepo.createRequest).toHaveBeenCalled();
    expect(sendVerificationEmail).toHaveBeenCalledWith(user.email, expect.any(String), user.username);
  });

  it("should throw an error if user is not found", async () => {
    const userId = 999;
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(authService.resendVerification(userId)).rejects.toThrow("User not found");
  });

  it("should throw an error if user is already verified", async () => {
    const userId = 1;
    const user = {
      id: userId,
      email: "test@example.com",
      username: "testuser",
      emailVerified: true,
    };
    mockUserRepo.findById.mockResolvedValue(user);

    await expect(authService.resendVerification(userId)).rejects.toThrow("User is already verified");
  });
});
