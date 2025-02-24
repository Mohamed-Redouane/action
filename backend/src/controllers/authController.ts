
import { Request, Response } from "express";
import { container } from "../container.js"; 
import { RegisterDTO } from "../dto/registerDTO.js";
import { LoginDTO } from "../dto/loginDTO.js";
import { clearSessionCookie, setSessionCookie } from "../services/sessionService.js";

export class AuthController {

  public async register(req: Request, res: Response): Promise<void> {
    try {
      const dto: RegisterDTO = req.body;
      const user = await container.authService.register(dto);

      
      res.status(201).json({
        message: "Registration successful. Check console for verification code.",
        user
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  }

  
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const dto: LoginDTO = req.body;
      const { user, sessionToken } = await container.authService.login(dto);

      setSessionCookie(res, sessionToken);

      res.status(200).json({
        message: "Login successful",
        user
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(401).json({ error: message });
    }
  }

 
  public async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies["session"];
      if (token) {
        await container.sessionRepository.deleteById(token);
      }

      clearSessionCookie(res);
      res.status(200).json({ message: "Logged out" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  }

  
  public async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { userId, code } = req.body;
      if (!userId || !code) {
        res.status(400).json({ error: "Must provide userId and verification code." });
        return;
      }

      await container.authService.verifyEmailByCode(userId, code);
      res.status(200).json({ message: "Email verified successfully" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  }
  public async requestPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        return void res.status(400).json({ error: "Email is required." });
      }
      await container.authService.requestPasswordReset(email);
      res.status(200).json({ message: "Reset requested. Check logs/email for code." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  }

  
  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { code, newPassword } = req.body;
      if (!code || !newPassword) {
        return void res.status(400).json({ error: "code and newPassword are required." });
      }
      await container.authService.resetPassword(code, newPassword);
      res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  }
  public async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.body;
      if (!userId) {
        return void res.status(400).json({ error: "userId is required." });
      }
      await container.authService.resendVerification(userId);
      res.status(200).json({ message: "New verification code sent. Check console or email." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ error: message });
    }
  }

public async me(req: Request, res: Response): Promise<void> {

  try {
    const token = req.cookies["session"];
    if (!token) {
      console.log("No session token provided");
      res.status(401).json({ error: "No session token provided" });
      return;
    }

    const session = await container.sessionRepository.findById(token);
    if (!session) {
      console.log("Invalid session token");
      res.status(401).json({ error: "Invalid session token" });
      return;
    }

    const nowSec = Math.floor(Date.now() / 1000);
    if (session.expiresAt < nowSec) {
      await container.sessionRepository.deleteById(token);
      console.log("Session expired");
      res.status(401).json({ error: "Session expired" });
      return;
    }

    const user = await container.userRepository.findById(session.userId);
    if (!user) {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
      return;
    }

    console.log("User found:", user);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.status(200).json({ user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in /me endpoint:", message);
    res.status(500).json({ error: message });
  }
}



}
