import { createClient } from 'redis'
import { env } from './env'
import { CacheManager } from '@pynspel/cache'

export const redis = new CacheManager(env.REDIS_URL)
