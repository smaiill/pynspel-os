import {
  getModuleDefaultConfig,
  InferModuleConfigType,
  ModulesTypes,
  validateModuleConfig,
} from '@pynspel/common'
import { Errors, HttpStatus } from '@pynspel/types'
import { IS_CLIENT_AVAILABLE } from 'managers/websocket'
import { db } from 'modules/db'
import { ObjectKeysPath } from 'types/utils'
import { HttpException, HttpZodValidationError } from 'utils/error'
import { accesToObjectKeyUsingPath } from 'utils/misc'
import { redis } from 'utils/redis'
import { DashboardService } from '../dashboard.service'

type ModuleBaseOptions<M extends ModulesTypes> = {
  update?: {
    validators?: {
      channels?: Array<ObjectKeysPath<InferModuleConfigType<M>>> | string[]
      roles?: Array<ObjectKeysPath<InferModuleConfigType<M>>> | string[]
    }
  }
}
export abstract class ModuleBase<M extends ModulesTypes> {
  private _db = db
  private _name = '' as ModulesTypes
  private _defaultConfig = {}
  private _options = {} as ModuleBaseOptions<M>
  constructor(name: M, options?: ModuleBaseOptions<M>) {
    this._name = name
    this._defaultConfig = getModuleDefaultConfig(this._name)
    this._options = options ?? {}
  }

  public async get(guildId: string) {
    const isClientInGuild = await this._db.isClientInGuild(guildId)

    if (!isClientInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, Errors.E_INVALID_GUILD_ID)
    }

    const cache = await redis.guild.getModule(guildId, this._name)

    if (cache) {
      return cache
    }

    const res = await this._db.getModuleConfigForGuild(guildId, this._name)

    if (!res) {
      await this._db.createModuleConfigForGuild(guildId, this._name)
      await redis.guild.setModule(
        guildId,
        this._name,
        this._defaultConfig as unknown as InferModuleConfigType<M>
      )

      return this._defaultConfig
    }

    const config = { ...this._defaultConfig, ...res }

    await redis.guild.setModule(guildId, this._name, config)

    return config
  }

  public async update({
    guildId,
    newConfig,
  }: {
    guildId: string
    newConfig: InferModuleConfigType<M>
  }) {
    if (!IS_CLIENT_AVAILABLE) {
      throw new HttpException(
        HttpStatus.SERVICE_UNAVAILABLE,
        Errors.E_SERVICE_UNAVAILABLE
      )
    }
    const isClientInGuild = await this._db.isClientInGuild(guildId)

    if (!isClientInGuild) {
      throw new HttpException(HttpStatus.FORBIDDEN, Errors.E_INVALID_GUILD_ID)
    }

    const [moduleStateDb] = await db.exec<{ active: boolean }>(
      'SELECT active FROM modules WHERE name = $1',
      [this._name]
    )

    if (!moduleStateDb?.active) {
      throw new HttpException(
        HttpStatus.BAD_REQUEST,
        Errors.E_SERVICE_UNAVAILABLE
      )
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

    const allChannelsToCheck =
      this?._options?.update?.validators?.channels
        ?.map((dataPath) => {
          const value = accesToObjectKeyUsingPath(
            dataPath as string,
            validatedData
          )

          return value ?? '_invalid-channel'
        })
        .flat() ?? []

    const allRolesToCheck =
      this?._options?.update?.validators?.roles
        ?.map((dataPath) => {
          const value = accesToObjectKeyUsingPath(
            dataPath as string,
            validatedData
          )

          return value ?? '_invalid-role'
        })
        .flat() ?? []

    await this.validChannelsAndRoles(
      guildId,
      allChannelsToCheck as string[],
      allRolesToCheck as string[]
    )

    const values = [guildId, JSON.stringify(validatedData), this._name]

    await this._db.exec<{
      config: InferModuleConfigType<M>
    }>(query, values)

    try {
      await redis.guild.setModule(guildId, this._name, validatedData)
    } catch (error) {
      await redis.guild.invalidateModule(guildId, this._name)
    }

    return validatedData
  }

  private async validChannelsAndRoles(
    guildId: string,
    channels: string[],
    roles: string[]
  ) {
    if (roles.length > 0) {
      const validRoles = await DashboardService.getCachedRolesOrFresh(guildId)

      const areRolesValid = roles.every((roleId) => {
        const value = validRoles.find((role) => role.id === roleId)

        return Boolean(value)
      })

      if (!areRolesValid) {
        throw new HttpException(HttpStatus.BAD_REQUEST, Errors.E_UNKNOWN_ROLE)
      }
    }

    if (channels.length > 0) {
      const validChannels = await DashboardService.getCachedChannelsOrFresh(
        guildId
      )

      const areChannelsValid = channels.every((channelId) => {
        const value = validChannels.find((channel) => channel.id === channelId)

        return Boolean(value)
      })

      if (!areChannelsValid) {
        throw new HttpException(
          HttpStatus.BAD_REQUEST,
          Errors.E_UNKNOWN_CHANNEL
        )
      }
    }
  }

  protected validateConfig(config: InferModuleConfigType<M>) {
    const res = validateModuleConfig(this._name, config)

    if (!res.success) {
      throw new HttpZodValidationError(res.error ?? [])
    }

    return res.data
  }
}
