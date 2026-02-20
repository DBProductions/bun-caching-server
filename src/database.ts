import { SQL } from 'bun';
import type { DatabaseConfig, User, PartialUser } from './types';
import { selectQuery, insertQuery, updateQuery, replaceQuery, deleteQuery } from './queries';

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
      if (!result[0]) return null;
      return await this.select(String(result[0].id));
    } catch (error: any) {
      throw error;
    }
  }

  async update(id: string, user: PartialUser) {
    try {
      const result: any = await updateQuery(this.db, id, user);
      if (!result[0]) return null;
      return await this.select(id);
    } catch (error: any) {
      throw error;
    }
  }

  async replace(id: string, user: User) {
    try {
      const result: any = await replaceQuery(this.db, id, user);
      if (!result[0]) return null;
      return await this.select(id);
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
}
