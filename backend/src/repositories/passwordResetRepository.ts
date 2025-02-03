// src/repositories/passwordResetRepository.ts

import { Pool } from "pg";

/**
 * Represents a row in 'password_reset_session'
 */
export interface PasswordResetSession {
  id: string;          // We'll typically set this to the same as 'code'
  userId: number;
  email: string;
  code: string;        // the random reset code
  expiresAt: number;   // Unix epoch integer
  emailVerified: number; // 0 or 1, if you use it
}

export class PasswordResetRepository {
  constructor(private pool: Pool) {}

  /**
   * Creates a new password reset row
   * @param data The reset session data
   */
  public async createRequest(data: Omit<PasswordResetSession, "id" | "emailVerified"> & { emailVerified?: number }): Promise<void> {
    // We can use code as the primary key ID or generate something else.
    // If we do ID=code:
    const id = data.code;
    const emailVerified = data.emailVerified ?? 0; // default to 0 if not provided
    const query = `
      INSERT INTO "password_reset_session" (id, user_id, email, code, expires_at, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [id, data.userId, data.email, data.code, data.expiresAt, emailVerified];
    await this.pool.query(query, values);
  }

  /**
   * Finds a reset session by its code
   */
  public async findByCode(code: string): Promise<PasswordResetSession | null> {
    const query = `
      SELECT id, user_id, email, code, expires_at, email_verified
      FROM "password_reset_session"
      WHERE code = $1
    `;
    const result = await this.pool.query(query, [code]);
    if (result.rowCount === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      email: row.email,
      code: row.code,
      expiresAt: row.expires_at,
      emailVerified: row.email_verified
    };
  }

  /**
   * Deletes a reset session by its primary key (id).
   * In our usage, "id" == code, but if you do them differently, adjust accordingly.
   */
  public async deleteById(id: string): Promise<void> {
    const query = `DELETE FROM "password_reset_session" WHERE id = $1`;
    await this.pool.query(query, [id]);
  }

  /**
   * Deletes all reset sessions for a given user
   */
  public async deleteByUserId(userId: number): Promise<void> {
    const query = `DELETE FROM "password_reset_session" WHERE user_id = $1`;
    await this.pool.query(query, [userId]);
  }
}
