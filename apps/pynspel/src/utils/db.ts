import { Pool } from 'pg'
import { env } from 'utils/env'

const generateConnectionPool = () => {
  try {
    return new Pool({
      host: env.DB_HOSTNAME,
      user: env.DB_USERNAME,
      database: env.DB_DATABASE,
      password: env.DB_PASSWORD,
      port: env.DB_PORT,
    })
  } catch (e) {
    console.error(`Error while creating pool connection: ${e}`)
  }
}

export const pool = generateConnectionPool()
