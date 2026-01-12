/**
 * @author Arman Hazrati
 * Redis caching service with advanced strategies
 */
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string;
}

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly redis: Redis;
  private readonly defaultTTL = 3600; // 1 hour

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get('REDIS_HOST', 'localhost'),
      port: this.configService.get('REDIS_PORT', 6379),
      password: this.configService.get('REDIS_PASSWORD'),
      db: this.configService.get('REDIS_DB', 0),
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.redis.on('connect', () => {
      this.logger.log('Redis cache connected successfully');
    });

    this.redis.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      this.logger.error(`Error getting cache key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    try {
      const ttl = options?.ttl || this.defaultTTL;
      const fullKey = options?.prefix ? `${options.prefix}:${key}` : key;
      await this.redis.setex(fullKey, ttl, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Error setting cache key ${key}:`, error);
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      this.logger.error(`Error deleting cache key ${key}:`, error);
    }
  }

  /**
   * Delete multiple keys matching pattern
   */
  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        this.logger.log(`Deleted ${keys.length} keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting pattern ${pattern}:`, error);
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get or set pattern - fetch from cache or execute function and cache result
   */
  async getOrSet<T>(key: string, factory: () => Promise<T>, options?: CacheOptions): Promise<T> {
    try {
      // Try to get from cache
      const cached = await this.get<T>(key);
      if (cached !== null) {
        this.logger.debug(`Cache hit for key: ${key}`);
        return cached;
      }

      // Cache miss - execute factory function
      this.logger.debug(`Cache miss for key: ${key}`);
      const value = await factory();

      // Store in cache
      await this.set(key, value, options);

      return value;
    } catch (error) {
      this.logger.error(`Error in getOrSet for key ${key}:`, error);
      // If caching fails, still return the value from factory
      return await factory();
    }
  }

  /**
   * Increment counter
   */
  async increment(key: string, amount = 1): Promise<number> {
    try {
      return await this.redis.incrby(key, amount);
    } catch (error) {
      this.logger.error(`Error incrementing key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Decrement counter
   */
  async decrement(key: string, amount = 1): Promise<number> {
    try {
      return await this.redis.decrby(key, amount);
    } catch (error) {
      this.logger.error(`Error decrementing key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Set with expiration (EX)
   */
  async setWithExpiry(key: string, value: any, seconds: number): Promise<void> {
    try {
      await this.redis.setex(key, seconds, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Error setting key with expiry ${key}:`, error);
    }
  }

  /**
   * Get TTL of a key
   */
  async getTTL(key: string): Promise<number> {
    try {
      return await this.redis.ttl(key);
    } catch (error) {
      this.logger.error(`Error getting TTL for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Flush all cache
   */
  async flushAll(): Promise<void> {
    try {
      await this.redis.flushdb();
      this.logger.warn('Cache flushed');
    } catch (error) {
      this.logger.error('Error flushing cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    keys: number;
    memory: string;
    hits: number;
    misses: number;
  }> {
    try {
      const info = await this.redis.info('stats');
      const keyspace = await this.redis.info('keyspace');
      const memory = await this.redis.info('memory');

      // Parse info strings
      const keysMatch = keyspace.match(/keys=(\d+)/);
      const hitsMatch = info.match(/keyspace_hits:(\d+)/);
      const missesMatch = info.match(/keyspace_misses:(\d+)/);
      const memoryMatch = memory.match(/used_memory_human:(.+)/);

      return {
        keys: keysMatch ? parseInt(keysMatch[1], 10) : 0,
        memory: memoryMatch ? memoryMatch[1].trim() : '0B',
        hits: hitsMatch ? parseInt(hitsMatch[1], 10) : 0,
        misses: missesMatch ? parseInt(missesMatch[1], 10) : 0,
      };
    } catch (error) {
      this.logger.error('Error getting cache stats:', error);
      return { keys: 0, memory: '0B', hits: 0, misses: 0 };
    }
  }
}
