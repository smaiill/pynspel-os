import { HttpStatus } from '@pynspel/types'
import { HttpException } from 'utils/error.handler'
import { db } from 'modules/db'
import {
  InferModuleConfigType,
  ModulesTypes,
  getModuleDefaultConfig,
  validateModuleConfig,
} from '@pynspel/common'

export abstract class ModuleBase<M extends ModulesTypes> {
  private _db = db
  _name = '' as ModulesTypes
  _defaultConfig = {}
  constructor(name: M) {
    this._name = name
    this._defaultConfig = getModuleDefaultConfig(name)
  }

  public async get(guildId: string) {
    const isClientInGuild = await this._db.isClientInGuild(guildId)

    if (!isClientInGuild) {
      throw new HttpException(HttpStatus.BAD_GATEWAY, 'Client not in guild.')
    }

    const query = `
      SELECT config
      FROM guild_modules
      JOIN modules ON guild_modules.module_id = modules.module_id
      WHERE guild_id = $1 AND modules.name = $2;
    `

    const [res] = await this._db.exec<{
      config: InferModuleConfigType<M>
    }>(query, [guildId, this._name])

    if (!res) {
      await this.create(guildId)
      return getModuleDefaultConfig(this._name)
    }

    console.log(
      `Getting config for module: ${this._name} config: ${JSON.stringify({
        default: JSON.stringify(getModuleDefaultConfig(this._name)),
        configInDatabase: JSON.stringify(res.config),
      })}`
    )

    return { ...getModuleDefaultConfig(this._name), ...res.config }
  }

  public async create(guildId: string) {
    const query = `
        INSERT INTO guild_modules (guild_id, module_id, is_active, config)
        SELECT $1, module_id, $3, $4
        FROM modules
        WHERE name = $2
        RETURNING *
    `

    const values = [
      guildId,
      this._name,
      true,
      JSON.stringify(getModuleDefaultConfig(this._name)),
    ]

    await this._db.exec(query, values)
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
    console.log(
      `Updating config for module: ${
        this._name
      } with new config: ${JSON.stringify(newConfig)}`
    )
    const query = `
    UPDATE guild_modules
    SET config = $2
    FROM modules
    WHERE guild_modules.module_id = modules.module_id
    AND guild_id = $1 AND modules.name = $3
    RETURNING config;
    `

    const validatedData = this.validateConfig(newConfig)

    const values = [guildId, JSON.stringify(validatedData), this._name]

    const [res] = await this._db.exec<{
      config: InferModuleConfigType<M>
    }>(query, values)

    return res.config
  }

  protected validateConfig(config: InferModuleConfigType<M>) {
    const res = validateModuleConfig(this._name, config)

    if (!res.success) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'Invalid configuration')
    }

    return res.data
  }
}
