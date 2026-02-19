import { RedisClient } from 'bun';
import type { CacheConfig, CacheError, User } from './types';

export class Cache {
  private redis: RedisClient;
  private readonly defaultTtl: number;

  constructor(config: CacheConfig) {
    this.redis = new RedisClient(config.redisUrl,{
      connectionTimeout: config.connectionTimeout,
      maxRetries: config.maxRetries
    });
    this.defaultTtl = config.defaultTtl;
  }

  async check(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch (error) {
      console.error("cache health check failed:", error);
      return false;
    }
  }

  async get(cacheKey: string) {
    try {
      return await this.redis.get(cacheKey);
    } catch (error: any) {
      throw error;
    }
  }

  async set(cacheKey: string, user: User, ttl: number = this.defaultTtl) {
    try {
      await this.redis.set(cacheKey, JSON.stringify(user), 'EX', ttl);
    } catch (error: any) {
      throw error;
    }
  }

  async delete(cacheKey: string) {
    try {
      return await this.redis.del(cacheKey);
    } catch (error: any) {
      throw error;
    }
  }
}
