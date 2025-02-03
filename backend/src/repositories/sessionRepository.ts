import { Pool } from "pg";


export interface SessionEntity {
  id: string;      
  userId: number;   
  expiresAt: number; 
}

export class SessionRepository {
  constructor(private pool: Pool) {}

 
  public async createSession(session: SessionEntity): Promise<void> {
    const query = `
      INSERT INTO "session" (id, user_id, expires_at)
      VALUES ($1, $2, $3)
    `;
    const values = [session.id, session.userId, session.expiresAt];
    await this.pool.query(query, values);
  }

  public async findById(id: string): Promise<SessionEntity | null> {
    const query = `
      SELECT id, user_id, expires_at
      FROM "session"
      WHERE id = $1
    `;
    const result = await this.pool.query(query, [id]);
    if (result.rowCount === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      expiresAt: row.expires_at
    };
  }

 
  public async deleteById(id: string): Promise<void> {
    await this.pool.query(`DELETE FROM "session" WHERE id = $1`, [id]);
  }
}
