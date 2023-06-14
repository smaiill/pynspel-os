import { createCipheriv, createDecipheriv } from 'crypto'
import { env } from './env'

const ALGORITHM = 'aes256'

export const _encrypt = (src: string) => {
  const cipher = createCipheriv(ALGORITHM, env.CRYPTION_KEY, env.CRYPTION_IV)
  return cipher.update(src, 'utf-8', 'hex') + cipher.final('hex')
}

export const _decrypt = (src: string) => {
  const decipher = createDecipheriv(
    ALGORITHM,
    env.CRYPTION_KEY,
    env.CRYPTION_IV
  )
  return decipher.update(src, 'hex', 'utf-8') + decipher.final('utf-8')
}
