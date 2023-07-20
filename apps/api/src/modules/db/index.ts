import { _DbWrapper } from '@pynspel/db'
import { env } from 'utils/env'

export const db = new _DbWrapper({ uri: env.DB_URI })
