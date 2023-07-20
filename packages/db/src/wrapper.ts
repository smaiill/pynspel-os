import { Pool } from 'pg'

import { Guild, KeysToCamelCase } from '@pynspel/types'

export type DbWrapperOptions = {
  debug?: boolean
  uri: string
}

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  ESCAPE: '\x1b[0m',
  CYAN: '\x1b[36m',
} as const

type ColorKey = keyof typeof COLORS
type ColorValue = (typeof COLORS)[ColorKey]

const _customLog = (color: ColorValue, content: unknown) =>
  console.log(color, content, COLORS.ESCAPE)

export class _DbWrapper {
  private _pool: undefined | Pool
  private _debug = false
  private _uri = ''

  constructor(options: DbWrapperOptions) {
    this._debug = options.debug ?? false
    this._uri = options.uri
    this._pool = this.generatePool()
  }

  private generatePool() {
    try {
      return new Pool({
        connectionString: this._uri,
      })
    } catch (e) {
      console.warn(`Error while creating db pool connection. ${e}`)
    }
  }

  private debug(query: string, values: unknown[]) {
    this._debug &&
      _customLog(
        COLORS.GREEN,
        `executing query ${COLORS.YELLOW}[${query}]${COLORS.GREEN} with args ${
          COLORS.YELLOW
        }${JSON.stringify(values)}`
      )
  }

  public async exec<T = unknown>(query: string, values: unknown[] = []) {
    const res = await this._pool?.query(query, values)

    if (!res) {
      throw new DbError(`Error while executing the query: ${query}`)
    }

    this.debug(query, values)

    return <[T]>res.rows
  }

  public async isClientInGuild(guildId: string) {
    const query = 'SELECT EXISTS(SELECT 1 FROM guilds WHERE guild_id = $1)'
    const values = [guildId]

    const [res] = await this.exec<{ exists: boolean }>(query, values)

    return res.exists
  }

  public async createGuild({ guildId, avatar, name }: KeysToCamelCase<Guild>) {
    const query =
      'INSERT INTO guilds (guild_id, avatar, name) VALUES ($1, $2, $3)'
    const values = [guildId, avatar, name]

    await this.exec(query, values)

    return { guildId, avatar, name }
  }
}

class DbError extends Error {
  constructor(message: string) {
    super(message)
  }
}
