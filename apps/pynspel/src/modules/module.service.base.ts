import {
  getModuleDefaultConfig,
  InferModuleConfigType,
  ModulesTypes,
} from '@pynspel/common'
import { db } from '../db'
import { redis } from '../utils/redis'

export class ModuleServiceBase<M extends ModulesTypes> {
  protected _db = db
  protected _cache = redis
  protected _defaultConfig: InferModuleConfigType<M>
  constructor(private name: M) {
    this._defaultConfig = getModuleDefaultConfig(this.name)
  }

  public async getFreshConfigOrCached(guildId: string) {
    const cache = await this._cache.getModule(guildId, this.name)

    if (cache) {
      return { ...this._defaultConfig, ...cache }
    }

    const res = await this._db.getOrCreateModuleConfigForGuild(
      guildId,
      this.name
    )

    await this._cache.setModule(guildId, this.name, res)

    return { ...this._defaultConfig, ...res }
  }
}
