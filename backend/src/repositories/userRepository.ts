import { Pool } from "pg";
import type { RegisterDTO } from "../dto/registerDTO.js";

export interface User {
  id: number;
  email: string;
  username: string;
  emailVerified: boolean;
}

export class UserRepository {
  constructor(private pool: Pool) {}

  public async createUser(dto: RegisterDTO, passwordHash: string): Promise<User> {
    const query = `
      INSERT INTO "user" (email, username, password_hash, email_verified)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, username, email_verified
    `;
    const values = [dto.email, dto.username, passwordHash, false];

    try {
      const result = await this.pool.query(query, values);
      if (result.rowCount === 0) {
        throw new Error("Failed to create user");
      }
      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        username: row.username,
        emailVerified: row.email_verified
      };
    } catch (error: any) {
      if (error.code === "23505") {
        if (error.detail.includes("email")) {
          throw new Error("Email already exists");
        } else if (error.detail.includes("username")) {
          throw new Error("Username already exists");
        }
      }
      throw new Error("An error occurred while creating the user");
    }
  }

  public async getUserPasswordHash(userId: number): Promise<string> {
    const query = `SELECT password_hash FROM "user" WHERE id = $1`;
    const result = await this.pool.query(query, [userId]);

    if (result.rowCount === 0) {
      throw new Error("Invalid user ID");
    }
    return result.rows[0].password_hash;
  }

 
  public async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, username, email_verified
      FROM "user"
      WHERE email = $1
    `;
    const result = await this.pool.query(query, [email]);

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      emailVerified: row.email_verified
    };
  }

 
  public async setUserAsEmailVerified(userId: number): Promise<void> {
    const query = `UPDATE "user" SET email_verified = true WHERE id = $1`;
    await this.pool.query(query, [userId]);
  }
  public async updatePasswordHash(userId: number, newHash: string): Promise<void> {
    const query = `UPDATE "user" SET password_hash = $1 WHERE id = $2`;
    await this.pool.query(query, [newHash, userId]);
  }

  public async findById(userId: number): Promise<User | null> {
    const query = `
      SELECT id, email, username, email_verified
      FROM "user"
      WHERE id = $1
    `;
    const result = await this.pool.query(query, [userId]);
    if (result.rowCount === 0) return null;
    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      emailVerified: row.email_verified
    };
  }
  
}
