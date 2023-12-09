import { redis } from 'utils/redis'

export const getUserRateLimit = async (key: string) => {
  const res = await redis._client.get(key)

  if (!res) {
    return { exists: false, value: 0 }
  }

  return { exists: true, value: Number(res) }
}
