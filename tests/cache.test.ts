import { expect, test, describe } from "bun:test";
import { Cache } from '../src/cache';
import type { CacheConfig, User } from '../src/types';

describe('Cache', () => {
  test("constructor initializes cache with config", () => {
    const config: CacheConfig = {
      redisUrl: "redis://localhost:6379",
      defaultTtl: 3600,
      connectionTimeout: 5000,
      maxRetries: 3
    };
    
    const cache = new Cache(config);
    expect(cache).toBeDefined();
  });

  test("checkCache returns false when Redis unavailable", async () => {
    const config: CacheConfig = {
      redisUrl: "redis://invalid-host:6379",
      defaultTtl: 3600,
      connectionTimeout: 1000,
      maxRetries: 1
    };
    
    const cache = new Cache(config);
    const result = await cache.check();
    expect(result).toBe(false);
  });

  test("cache methods handle Redis connection errors gracefully", async () => {
    const config: CacheConfig = {
      redisUrl: "redis://invalid-host:6379",
      defaultTtl: 3600,
      connectionTimeout: 1000,
      maxRetries: 1
    };
    
    const cache = new Cache(config);
    
    // Test get method doesn't crash
    await expect(cache.get("user:1")).rejects.toThrow();
    
    // Test set method doesn't crash
    const user: User = { id: 1, name: "Test User", email: "test@test.com", mobile: "1234567890" };
    await expect(cache.set("user:1", user)).rejects.toThrow();
    
    // Test delete method doesn't crash
    await expect(cache.delete("user:1")).rejects.toThrow();
  });
});