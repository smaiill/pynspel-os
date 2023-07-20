import NodeCache from 'node-cache'

export const usersCache = new NodeCache()
export const Caches = {
  Users: 'users',
} as const
