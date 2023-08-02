import { CacheManager } from '@pynspel/cache'
import { env } from './env'

export const redis = new CacheManager(env.REDIS_URL)
