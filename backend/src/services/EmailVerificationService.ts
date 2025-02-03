
import { randomBytes } from "crypto";
import { Pool } from "pg";


export interface EmailVerificationRequest {
  id: string;         
  userId: number;
  code: string;       
  email: string;
  expiresAt: number;  
}


function generateRandomOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


export class EmailVerificationService {
  constructor(private pool: Pool) {}



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
      expiresAt: row.expires_at 
    };
  }


  public async createRequest(userId: number, email: string): Promise<EmailVerificationRequest> {

    await this.deleteRequestByUserId(userId);

    const idBytes = randomBytes(16); 
    const id = idBytes.toString("hex"); 

    const code = generateRandomOTP();

    const expiresAt = Math.floor((Date.now() + 1000 * 60 * 10) / 1000);

    const insertQuery = `
      INSERT INTO email_verification_request (id, user_id, code, email, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const insertValues = [id, userId, code, email, expiresAt];
    await this.pool.query(insertQuery, insertValues);

    return {
      id,
      userId,
      code,
      email,
      expiresAt
    };
  }

 
  public async deleteRequestByUserId(userId: number): Promise<void> {
    const query = `DELETE FROM email_verification_request WHERE user_id = $1`;
    await this.pool.query(query, [userId]);
  }

  
  public sendVerificationEmail(email: string, code: string): void {
    console.log(`🚀 [DEV] To ${email}: your verification code is ${code}`);
  }
}
