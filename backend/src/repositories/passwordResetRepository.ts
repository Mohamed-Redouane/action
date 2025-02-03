
import { Pool } from "pg";

export interface PasswordResetSession {
  id: string;         
  userId: number;
  email: string;
  code: string;        
  expiresAt: number;   
  emailVerified: number; 
}

export class PasswordResetRepository {
  constructor(private pool: Pool) {}

  
  public async createRequest(data: Omit<PasswordResetSession, "id" | "emailVerified"> & { emailVerified?: number }): Promise<void> {
    
    const id = data.code;
    const emailVerified = data.emailVerified ?? 0; 
    const query = `
      INSERT INTO "password_reset_session" (id, user_id, email, code, expires_at, email_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    const values = [id, data.userId, data.email, data.code, data.expiresAt, emailVerified];
    await this.pool.query(query, values);
  }

  
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

  
  public async deleteById(id: string): Promise<void> {
    const query = `DELETE FROM "password_reset_session" WHERE id = $1`;
    await this.pool.query(query, [id]);
  }

  
  public async deleteByUserId(userId: number): Promise<void> {
    const query = `DELETE FROM "password_reset_session" WHERE user_id = $1`;
    await this.pool.query(query, [userId]);
  }
}
