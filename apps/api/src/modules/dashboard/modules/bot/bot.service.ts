import { BotModuleConfig, HTTPCode } from '@pynspel/types'
import { pool } from 'modules/db/pool'
import { HTTPError } from 'utils/error.handler'

class _BotModuleService {
  public async getOrCreateGuildConfig({ guildId }: { guildId: bigint }) {
    const selectQuery = `
    SELECT *
    FROM guild_modules
    JOIN modules ON guild_modules.module_id = modules.module_id
    WHERE guild_id = $1 AND modules.name = 'bot';
  `

    const insertQuery = `
    INSERT INTO guild_modules (guild_id, module_id, is_active, config)
    SELECT $1, module_id, $3, $4
    FROM modules
    WHERE name = $2
    ON CONFLICT DO NOTHING
    RETURNING *;
  `

    try {
      const selectResult = await pool?.query(selectQuery, [guildId])

      if (selectResult?.rows[0]) {
        return selectResult.rows[0].config
      } else {
        await pool?.query('BEGIN')
        // eslint-disable-next-line no-unsafe-optional-chaining
        const { rows } = await pool?.query(insertQuery, [
          guildId,
          'bot',
          false,
          JSON.stringify({ name: 'pynspel' }),
        ])
        await pool?.query('COMMIT')

        return rows[0].config
      }
    } catch (error) {
      await pool?.query('ROLLBACK')
      console.log(error)
      throw new HTTPError(
        HTTPCode.SERVER_ERROR,
        'Erro while executing the request'
      )
    }
  }

  public async updateGuildConfig({
    guildId,
    config,
  }: {
    guildId: bigint
    config: BotModuleConfig
  }) {
    const updateQuery = `
      UPDATE guild_modules
      SET config = $2
      WHERE guild_id = $1
      RETURNING config;
    `

    try {
      const { rows } = await pool?.query(updateQuery, [
        guildId,
        JSON.stringify(config),
      ])

      if (rows[0]) {
        return rows[0].config
      } else {
        throw new Error('La mise à jour de la configuration a échoué.')
      }
    } catch (error) {
      console.log(error)
      throw new HTTPError(
        HTTPCode.SERVER_ERROR,
        "Erreur lors de l'exécution de la requête."
      )
    }
  }
}

export const BotModuleService = new _BotModuleService()
