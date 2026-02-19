import type { CacheError, DatabaseError, User, PartialUser } from './types';
import { Database } from './database';
import { Cache } from './cache';

export class Service {
  constructor(
    private readonly database: Database,
    private readonly cache: Cache
  ) {}

  validateData(user: User) {
    if (!user?.name || typeof user.name !== "string") {
      return "Validation error: Name is required and must be a string";
    }
    if (!user?.email || typeof user.email !== "string") {
      return "Validation error: Email is required and must be a string";
    }
    return null;
  }

  validatePartialData(user: PartialUser) {
    if (user?.name && typeof user.name !== "string") {
      return "Validation error: Name must be a string";
    }
    if (user?.email && typeof user.email !== "string") {
      return "Validation error: Email must be a string";
    }
    if (user?.mobile && typeof user.mobile !== "string") {
      return "Validation error: Mobile must be a string";
    }
    return null;
  }
  
  logError(error: CacheError | DatabaseError, operation: string): void {
    if (error.code === "ERR_REDIS_CONNECTION_CLOSED") {
      console.error("Connection to Redis server was closed");
    } else if (error.code === "ERR_REDIS_AUTHENTICATION_FAILED") {
      console.error("Authentication failed");
    } else if (error.code === "ERR_POSTGRES_CONNECTION_CLOSED") {
      console.error("Connection to PostgreSQL server was closed");
    } else if (error.code === "ERR_POSTGRES_CONNECTION_TIMEOUT") {
      console.error("Connection to PostgreSQL server timeout");
    } else {
      console.error(`Error while ${operation}:`, error);
    }
  }

  async getUser(userId: string) {
    const cacheKey = `user:${userId}`;
    try {
      const cachedUser = await this.cache.get(cacheKey);
      if (cachedUser) return JSON.parse(cachedUser);
    } catch(error: any) {
      this.logError(error, 'getUser');
      throw error;
    }
    try {
      const user = await this.database.select(userId);
      if (!user) return null;
      await this.cache.set(cacheKey, user);
      return user;
    } catch(error: any) {
      this.logError(error, 'getUser');
      throw error;
    }
  }

  async setUser(user: User): Promise<User> {
    const validationError = this.validateData(user)
    if (validationError) throw new Error(validationError);
    if (await this.database.emailExists(user.email)) {
      throw new Error("Email already exists");
    }
    if (await this.database.mobileExists(user.mobile)) {
      throw new Error("Mobile already exists");
    }
    const newUser = await this.database.create(user)
    if (!newUser) throw new Error("Failed to create user");
    await this.cache.set(`user:${newUser.id}`, newUser);
    return newUser;
  }

  async updateUser(id: string, user: PartialUser) {
    const validationError = this.validatePartialData(user);
    if (validationError) throw new Error(validationError);
    const updatedUser = await this.database.update(id, user);
    await this.cache.set(`user:${id}`, updatedUser);
    return updatedUser;
  }

  async replaceUser(id: string, user: User) {
    const validationError = this.validateData(user)
    if (validationError) throw new Error(validationError);
    const replacedUser = await this.database.replace(id, user);
    await this.cache.set(`user:${id}`, replacedUser);
    return replacedUser;
  }

  async delUser(userId: string) {
    await this.cache.delete(`user:${userId}`);
    return await this.database.delete(userId);
  }
}
