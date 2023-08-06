import { Pool } from 'pg'

import {
  getModuleDefaultConfig,
  InferModuleConfigType,
  ModulesTypes,
} from '@pynspel/common'
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
  console.log(`${color}${content}`, COLORS.ESCAPE)

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
    this._debug && _customLog(COLORS.GREEN, `${COLORS.CYAN}${query}`)
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

  public async getModuleConfigForGuild<
    M extends ModulesTypes,
    Return extends InferModuleConfigType<M>
  >(guildId: string, moduleName: M): Promise<Return> {
    const query = `
      SELECT config FROM guild_modules JOIN modules ON guild_modules.module_id = modules.module_id WHERE guild_id = $1 AND modules.name = $2;
    `
    const [res] = await this.exec<{ config: Return }>(query, [
      guildId,
      moduleName,
    ])

    return res?.config
  }

  public async createModuleConfigForGuild<
    M extends ModulesTypes,
    Return extends InferModuleConfigType<M>
  >(guildId: string, moduleName: M): Promise<Return> {
    const query = `
      INSERT INTO guild_modules (guild_id, module_id, is_active, config)
      SELECT $1, module_id, $3, $4
      FROM modules
      WHERE name = $2
    `

    const defaultConfig = getModuleDefaultConfig(moduleName)

    const values = [guildId, moduleName, true, JSON.stringify(defaultConfig)]

    await this.exec(query, values)

    return defaultConfig
  }

  public async getOrCreateModuleConfigForGuild<M extends ModulesTypes>(
    guildId: string,
    moduleName: M
  ) {
    const res = await this.getModuleConfigForGuild(guildId, moduleName)

    if (!res) {
      return await this.createModuleConfigForGuild(guildId, moduleName)
    }

    return res
  }
}

class DbError extends Error {
  constructor(message: string) {
    super(message)
  }
}
