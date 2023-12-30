import { Commands, InferModuleConfigType, Modules } from '@pynspel/common'
import { ModuleServiceBase } from 'modules/module.service.base'

export class _CommandService extends ModuleServiceBase<'command'> {
  constructor() {
    super(Modules.command)
  }

  public async isCommandActive(guildId: string, command: keyof Commands) {
    const config = (await this.getFreshConfigOrCached(
      guildId
    )) as InferModuleConfigType<'command'>

    return config[command]
  }
}

export const commandService = new _CommandService()
