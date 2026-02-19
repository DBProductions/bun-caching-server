export interface CacheConfig {
  redisUrl: string;
  defaultTtl: number;
  connectionTimeout: number;
  maxRetries: number;
}

export interface DatabaseConfig {
  connectionString: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  city?: string;
  country?: string;
}

export interface PartialUser {
  id?: number;
  name?: string;
  email?: string;
  mobile?: string;
  city?: string;
  country?: string;
}
