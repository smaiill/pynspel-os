import {
  getModuleDefaultConfig,
  InferModuleConfigType,
  ModulesTypes,
  validateModuleConfig,
} from '@pynspel/common'
import { HttpStatus } from '@pynspel/types'
import { db } from 'modules/db'
import { HttpException, HttpZodValidationError } from 'utils/error'
import { redis } from 'utils/redis'

export abstract class ModuleBase<M extends ModulesTypes> {
  private _db = db
  _name = '' as ModulesTypes
  _defaultConfig = {}
  constructor(name: M) {
    this._name = name
    this._defaultConfig = getModuleDefaultConfig(this._name)
  }

  public async get(guildId: string) {
    const isClientInGuild = await this._db.isClientInGuild(guildId)

    if (!isClientInGuild) {
      throw new HttpException(HttpStatus.BAD_GATEWAY, 'Client not in guild.')
    }

    const cache = await redis.getGuidModule(guildId, this._name)
    if (cache) {
      console.log('Returning cached config', cache)
      return cache
    }

    const res = await this._db.getModuleConfigForGuild(guildId, this._name)

    if (!res) {
      await this._db.createModuleConfigForGuild(guildId, this._name)
      await redis.setGuildModule(
        guildId,
        this._name,
        this._defaultConfig as unknown as InferModuleConfigType<M>
      )

      return this._defaultConfig
    }

    const config = { ...this._defaultConfig, ...res }

    await redis.setGuildModule(guildId, this._name, config)

    return config
  }

  public async update({
    guildId,
    newConfig,
  }: {
    guildId: string
    newConfig: InferModuleConfigType<M>
  }) {
    const isClientInGuild = await this._db.isClientInGuild(guildId)

    if (!isClientInGuild) {
      throw new HttpException(HttpStatus.BAD_GATEWAY, 'Client not in guild.')
    }

    const query = `
      UPDATE guild_modules
      SET config = $2
      FROM modules
      WHERE guild_modules.module_id = modules.module_id
      AND guild_id = $1 AND modules.name = $3
      RETURNING config;
    `

    const validatedData = this.validateConfig(
      newConfig
    ) as InferModuleConfigType<M>

    const values = [guildId, JSON.stringify(validatedData), this._name]

    await this._db.exec<{
      config: InferModuleConfigType<M>
    }>(query, values)

    try {
      await redis.setGuildModule(guildId, this._name, validatedData)
    } catch (error) {
      await redis.invalidateGuildModule(guildId, this._name)
    }

    return validatedData
  }

  protected validateConfig(config: InferModuleConfigType<M>) {
    const res = validateModuleConfig(this._name, config)

    if (!res.success) {
      throw new HttpZodValidationError('Invalid configuration', res.error ?? [])
    }

    return res.data
  }
}
