/* eslint-disable no-console */
import { Pool } from 'pg'

import {
  getModuleDefaultConfig,
  InferModuleConfigType,
  ModulesTypes,
} from '@pynspel/common'

import { Guild, Ticket, TicketStatus } from '@pynspel/types'

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
      console.error(`Error while creating db pool connection. ${e}`)
    }
  }

  private debug(query: string) {
    this._debug && _customLog(COLORS.GREEN, `${COLORS.CYAN}${query}`)
  }

  public async exec<T = unknown>(query: string, values: unknown[] = []) {
    const res = await this._pool?.query(query, values)

    if (!res) {
      throw new DbError(`Error while executing the query: ${query}`)
    }

    this.debug(query)

    return <[T]>res.rows
  }

  public async isClientInGuild(guildId: string) {
    const query =
      'SELECT EXISTS(SELECT 1 FROM guilds WHERE guild_id = $1 AND bot = $2)'
    const values = [guildId, true]

    const [res] = await this.exec<{ exists: boolean }>(query, values)

    return res?.exists
  }

  public async updateGuild({
    guild_id,
    avatar,
    name,
    owner,
  }: Omit<Guild, 'bot'>) {
    const query =
      'UPDATE guilds SET avatar = $1, name = $2, bot = $3, owner = $4 WHERE guild_id = $5'
    const values = [avatar, name, true, owner, guild_id]

    await this.exec(query, values)

    return { guild_id, avatar, name, bot: true }
  }

  public async createGuild({
    guild_id,
    avatar,
    name,
    owner,
  }: Omit<Guild, 'bot'>) {
    const query =
      'INSERT INTO guilds (guild_id, avatar, name, bot, owner) VALUES ($1, $2, $3, $4, $5)'
    const values = [guild_id, avatar, name, true, owner]

    await this.exec(query, values)

    return { guild_id, avatar, name, bot: true, owner }
  }

  public async deleteGuild(guildId: string) {
    const query = 'UPDATE guilds SET bot = $1 WHERE guild_id = $2'
    const values = [false, guildId]

    await this.exec(query, values)

    return { bot: false }
  }

  public async handleNewGuild({
    guild_id,
    avatar,
    name,
    owner,
  }: Omit<Guild, 'bot'>) {
    const [exists] = await this.exec(
      'SELECT guild_id FROM guilds WHERE guild_id = $1',
      [guild_id]
    )

    const guildExists = !!exists

    if (!guildExists) {
      await this.createGuild({ guild_id, avatar, name, owner })
      return { guild_id, name, avatar, bot: true, owner }
    }

    await this.updateGuild({ guild_id, avatar, name, owner })
    return { guild_id, name, avatar, bot: true, owner }
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
  >(guildId: string, moduleName: M, isActive = true): Promise<Return> {
    const query = `
      INSERT INTO guild_modules (guild_id, module_id, is_active, config)
      SELECT $1, module_id, $3, $4
      FROM modules
      WHERE name = $2 RETURNING *
    `

    const defaultConfig = getModuleDefaultConfig(moduleName)

    const values = [
      guildId,
      moduleName,
      isActive,
      JSON.stringify(defaultConfig),
    ]

    await this.exec(query, values)

    return defaultConfig
  }

  public async getOrCreateModuleConfigForGuild<M extends ModulesTypes>(
    guildId: string,
    moduleName: M,
    isActive: boolean
  ) {
    const res = await this.getModuleConfigForGuild(guildId, moduleName)

    if (!res) {
      return this.createModuleConfigForGuild(guildId, moduleName, isActive)
    }

    return res
  }

  public async createTicket(ticket: Ticket) {
    const query =
      'INSERT INTO tickets (channel_id, author_id, guild_id, status) VALUES ($1, $2, $3, $4)'

    const values = [
      ticket.channel_id,
      ticket.author_id,
      ticket.guild_id,
      ticket.status,
    ]

    await this.exec(query, values)

    return ticket
  }

  public async closeTicket(channelId: string, guildId: string) {
    const query =
      'UPDATE tickets SET status = $1 WHERE channel_id = $2 AND guild_id = $3'
    const values = [TicketStatus.Closed, channelId, guildId]

    return this.exec(query, values)
  }

  public async getTicketById(id: string, guildId: string) {
    const query =
      'SELECT * FROM tickets WHERE channel_id = $1 AND guild_id = $2'
    const values = [id, guildId]

    const [channel] = await this.exec(query, values)

    if (!channel) {
      return null
    }

    return channel as Ticket
  }

  public async isModuleActiveForGuild(
    guildId: string,
    moduleName: ModulesTypes
  ) {
    const query =
      'SELECT is_active FROM guild_modules WHERE module_id = (SELECT module_id FROM modules WHERE name = $1 AND active = $2) AND guild_id = $3'
    const values = [moduleName, true, guildId]

    const [moduleData] = await this.exec<{ is_active?: boolean }>(query, values)

    return Boolean(moduleData?.is_active)
  }
}

class DbError extends Error {
  constructor(message: string) {
    super(message)
  }
}
