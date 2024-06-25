import { GuildPoll } from '@pynspel/common'
import { Px } from '@pynspel/px'
import { db } from 'db'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ChannelType,
  ComponentType,
} from 'discord.js'
import { logger } from 'utils/logger'
import { PollsChart } from './poll.chart'
import { PollsDB } from './poll.db'

export class PollsService {
  constructor(private pollsDB: PollsDB) {}

  public async add(interaction: ButtonInteraction, choice: string) {
    if (!interaction.user.id || interaction.user.bot) {
      return
    }

    const [poll] = await db.exec<GuildPoll>(
      'SELECT * FROM polls WHERE message_id = $1',
      [interaction.message.id]
    )

    if (!poll || !poll.id) {
      return
    }

    if (poll.end_at && new Date(poll.end_at).getTime() < Date.now()) {
      const newComponents = interaction.message.components.map((component) => {
        if (component.type !== ComponentType.ActionRow) {
          return component
        }

        const newChilds = component.components.map((cp2) => {
          if (cp2.type === ComponentType.Button) {
            return new ButtonBuilder(cp2.toJSON()).setDisabled()
          }

          return cp2
        })

        const newActionRowBuilder = new ActionRowBuilder()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newActionRowBuilder.setComponents(...newChilds)

        return newActionRowBuilder
      })

      await interaction.message.edit({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        components: newComponents,
      })
      return interaction.reply({ content: 'Expired', ephemeral: true })
    }

    await this.pollsDB.addOrEdit({
      choice: choice,
      poll: poll,
      userId: interaction.user.id,
    })

    interaction.reply({ content: 'You have voted', ephemeral: true })
  }

  public async deleteUserVotes(interaction: ButtonInteraction) {
    if (!interaction.user.id || interaction.user.bot) {
      return
    }

    const [poll] = await db.exec<GuildPoll>(
      'SELECT * FROM polls WHERE message_id = $1',
      [interaction.message.id]
    )

    if (!poll || !poll.id) {
      return
    }

    await this.pollsDB.deletePollForUser(poll.id, interaction.user.id)

    interaction.reply({
      content: 'Your votes have been deleted',
      ephemeral: true,
    })
  }

  public async updateAll(client: Px) {
    const polls = await db.exec<
      Pick<GuildPoll, 'id' | 'channel_id' | 'message_id'> & {
        counts: Record<string, number>
      }
    >(`
      SELECT 
        p.id, 
        p.channel_id, 
        p.message_id, 
        jsonb_object_agg(subquery.value, subquery.count) AS counts 
      FROM 
        (
          SELECT 
            poll_id, 
            value, 
            COUNT(*) AS count 
          FROM 
            polls_voters, 
            unnest(choice) AS value 
          GROUP BY 
            poll_id, 
            value
        ) subquery 
        LEFT JOIN polls p ON subquery.poll_id = p.id 
      WHERE 
        show_graph = true 
        AND channel_id IS NOT NULL 
        AND message_id IS NOT NULL 
        AND (
          end_at IS NULL 
          OR end_at < NOW()
        ) 
      GROUP BY 
        p.id, 
        p.channel_id, 
        p.message_id 
      ORDER BY 
        p.id;
      `)

    for await (const poll of polls) {
      try {
        const channel = await client.channels.fetch(poll.channel_id)

        if (!channel || channel.type !== ChannelType.GuildText) {
          return
        }

        const message = await channel.messages.fetch(poll.message_id)

        if (!message || !message.editable) {
          return
        }

        const chart = new PollsChart({
          width: 400,
          height: 200,
          barWidth: 20,
          barSpacing: 20,
          margin: 40,
          payload: poll.counts,
        })

        const buffer = chart.getBuffer()

        if (!buffer) {
          return
        }

        const [embed] = message.embeds

        if (!embed) {
          return
        }

        await message.edit({
          embeds: [
            { ...embed.toJSON(), image: { url: 'attachment://canvas.png' } },
          ],
          files: [
            {
              attachment: buffer,
              name: 'canvas.png',
            },
          ],
        })
      } catch (error) {
        logger.error((error as Error).stack)
      }
    }
  }
}
