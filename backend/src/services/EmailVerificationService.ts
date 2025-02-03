// src/services/emailVerificationService.ts

import { randomBytes } from "crypto";
import { Pool } from "pg";

/**
 * A simple interface representing the 'email_verification_request' table
 */
export interface EmailVerificationRequest {
  id: string;         // random string used as the primary key
  userId: number;
  code: string;       // the 6-digit or random code
  email: string;
  expiresAt: number;  // store as Unix epoch integer (seconds)
}

/**
 * Generate a random 6-digit numeric code
 */
function generateRandomOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * This service encapsulates CRUD operations for email verification requests
 */
export class EmailVerificationService {
  constructor(private pool: Pool) {}

  /**
   * Find a request by 'id' (and optionally userId) in 'email_verification_request'
   */
  public async getRequestById(id: string, userId: number): Promise<EmailVerificationRequest | null> {
    const query = `
      SELECT id, user_id, code, email, expires_at
      FROM email_verification_request
      WHERE id = $1 AND user_id = $2
    `;
    const values = [id, userId];
    const result = await this.pool.query(query, values);

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      code: row.code,
      email: row.email,
      expiresAt: row.expires_at // integer (Unix epoch)
    };
  }

  /**
   * Create a new verification request for the given user and email,
   * deleting any existing request for that user first.
   */
  public async createRequest(userId: number, email: string): Promise<EmailVerificationRequest> {
    // 1) delete existing request
    await this.deleteRequestByUserId(userId);

    // 2) generate a random ID for the request
    const idBytes = randomBytes(16); // 16 bytes = 128 bits
    const id = idBytes.toString("hex"); // e.g. 32-char hex string

    // 3) generate a code (like a 6-digit OTP)
    const code = generateRandomOTP();
    // set the expiry to 10 minutes from now (in seconds)
    const expiresAt = Math.floor((Date.now() + 1000 * 60 * 10) / 1000);

    // 4) insert into DB
    const insertQuery = `
      INSERT INTO email_verification_request (id, user_id, code, email, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const insertValues = [id, userId, code, email, expiresAt];
    await this.pool.query(insertQuery, insertValues);

    // 5) Return the new request
    return {
      id,
      userId,
      code,
      email,
      expiresAt
    };
  }

  /**
   * Delete a request by user ID (e.g. if creating a new request or after successful verify).
   */
  public async deleteRequestByUserId(userId: number): Promise<void> {
    const query = `DELETE FROM email_verification_request WHERE user_id = $1`;
    await this.pool.query(query, [userId]);
  }

  /**
   * Utility to console.log the verification code for demo (could be replaced by real email send).
   */
  public sendVerificationEmail(email: string, code: string): void {
    console.log(`🚀 [DEV] To ${email}: your verification code is ${code}`);
  }
}
