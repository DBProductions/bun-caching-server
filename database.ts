import { SQL } from 'bun';
import type { DatabaseConfig, DatabaseError, User, PartialUser } from './types';
import { entryExists, selectQuery, insertQuery, updateQuery, replaceQuery, deleteQuery } from './queries';

export class Database {
  private db: SQL;

  constructor(config: DatabaseConfig) {
    this.db = new SQL(config.connectionString);
  }

  async check(): Promise<boolean> {
    try {
      await this.db`SELECT 1`;
      return true;
    } catch (error) {
      console.error("DB health check failed:", error);
      return false;
    }
  }

  async select(userId: string) {
    try {
      const result: any = await selectQuery(this.db, userId);
      return result[0] || null;
    } catch(error: any) {
      throw error;
    }
  }

  async create(user: User) {
    try {
      const result: any = await insertQuery(this.db, user);
      return result[0] || null;
    } catch (error: any) {
      throw error;
    }
  }

  async update(id: string, user: PartialUser) {
    try {
      const result: any = await updateQuery(this.db, id, user);
      return result[0] || null;
    } catch (error: any) {
      throw error;
    }
  }

  async replace(id: string, user: User) {
    try {
      const result: any = await replaceQuery(this.db, id, user);
      return result[0] || null;
    } catch(error: any) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const result: any = await deleteQuery(this.db, id);
      return result[0] || null;
    } catch(error: any) {
      throw error;
    }
  }

  async emailExists(email: string) {
    try {
      //const result = await this.db`SELECT 1 FROM users WHERE email = ${email}`;
      const result = await entryExists(this.db, 'email', email);
      return result.length > 0;
    } catch(error: any) {
      console.error('Database error in emailExists:', error);
      return false;
    }
  }

  async mobileExists(mobile: string) {
    try {
      //const result = await this.db`SELECT 1 FROM users WHERE mobile = ${mobile}`;
      const result = await entryExists(this.db, 'mobile', mobile);
      return result.length > 0;
    } catch(error: any) {
      console.error('Database error in mobileExists:', error);
      return false;
    }
  }
}
