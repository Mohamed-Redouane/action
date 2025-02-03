import { Pool } from "pg";


export interface EmailVerificationRequest {
  id: string;
  userId: number;
  email: string;
  code: string;
  expiresAt: number; 
}

export class EmailVerificationRepository {
  constructor(private pool: Pool) {}


  public async createRequest(data: Omit<EmailVerificationRequest, "id"> & { id?: string }): Promise<void> {
  
    const id = data.id ?? data.code;
    const query = `
      INSERT INTO email_verification_request (id, user_id, code, email, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [id, data.userId, data.code, data.email, data.expiresAt];
    await this.pool.query(query, values);
  }

 
  public async findByUserIdAndCode(userId: number, code: string): Promise<EmailVerificationRequest | null> {
    const query = `
      SELECT id, user_id, code, email, expires_at
      FROM email_verification_request
      WHERE user_id = $1 AND code = $2
    `;
    const result = await this.pool.query(query, [userId, code]);
    if (result.rowCount === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      code: row.code,
      email: row.email,
      expiresAt: row.expires_at
    };
  }

  
  public async deleteRequestsByUserId(userId: number): Promise<void> {
    await this.pool.query(
      `DELETE FROM email_verification_request WHERE user_id = $1`,
      [userId]
    );
  }
}
