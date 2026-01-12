/**
 * @author Arman Hazrati
 * Cache decorator for method-level caching
 */
import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY_METADATA = 'cache:key';
export const CACHE_TTL_METADATA = 'cache:ttl';

export interface CacheDecoratorOptions {
  key?: string;
  ttl?: number; // seconds
}

/**
 * Decorator to enable caching for a method
 * @param options Caching options
 */
export const Cacheable = (options?: CacheDecoratorOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_KEY_METADATA, options?.key || propertyKey)(target, propertyKey, descriptor);
    SetMetadata(CACHE_TTL_METADATA, options?.ttl || 3600)(target, propertyKey, descriptor);
    return descriptor;
  };
};

/**
 * Decorator to invalidate cache
 */
export const CacheEvict = (pattern: string) => {
  return SetMetadata('cache:evict', pattern);
};
