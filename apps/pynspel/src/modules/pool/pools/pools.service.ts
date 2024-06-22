import { GuildPool } from '@pynspel/common'
import { db } from 'db'
import { ButtonInteraction } from 'discord.js'
import { PoolsDB } from './pools.db'

export class PoolsService {
  constructor(private poolsDB: PoolsDB) {}
  public async add(interaction: ButtonInteraction, choice: string) {
    if (!interaction.user.id || interaction.user.bot) {
      return
    }

    const [pool] = await db.exec<GuildPool>(
      'SELECT * FROM pools WHERE message_id = $1',
      [interaction.message.id]
    )

    if (!pool || !pool.id) {
      return
    }

    await this.poolsDB.addOrEdit({
      choice: choice,
      pool: pool,
      userId: interaction.user.id,
    })

    interaction.reply({ content: 'You have voted', ephemeral: true })
  }

  public async deleteUserVotes(interaction: ButtonInteraction) {
    if (!interaction.user.id || interaction.user.bot) {
      return
    }

    const [pool] = await db.exec<GuildPool>(
      'SELECT * FROM pools WHERE message_id = $1',
      [interaction.message.id]
    )

    if (!pool || !pool.id) {
      return
    }

    await this.poolsDB.deletePoolForUser(pool.id, interaction.user.id)

    interaction.reply({
      content: 'Your votes have been deleted',
      ephemeral: true,
    })
  }
}
