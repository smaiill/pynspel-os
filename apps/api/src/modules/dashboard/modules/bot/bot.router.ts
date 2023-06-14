import { Router } from 'express'
import { BotModuleService } from './bot.service'

const botModuleRouter = Router()

botModuleRouter.get('/:guildId', async (req, res) => {
  const { guildId } = req.params

  const _res = await BotModuleService.getOrCreateGuildConfig({
    guildId: BigInt(guildId),
  })

  res.json({ bot_module: _res })
})

botModuleRouter.put('/:guildId', async (req, res) => {
  const { guildId } = req.params
  const { config } = req.body

  try {
    const updatedConfig = await BotModuleService.updateGuildConfig({
      guildId: BigInt(guildId),
      config,
    })

    res.json({ bot_module: updatedConfig })
  } catch (error) {
    res.status(500).json({
      error:
        'Une erreur est survenue lors de la mise à jour de la configuration.',
    })
  }
})

export { botModuleRouter }
