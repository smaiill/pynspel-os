import { BaseEvent } from '@pynspel/px'
import { TicketStatus } from '@pynspel/types'
import { db } from 'db'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChannelType,
  Client,
  Colors,
  EmbedBuilder,
  Guild,
  Interaction,
  InteractionReplyOptions,
  PermissionFlagsBits,
} from 'discord.js'
import { TicketService } from 'modules/ticket/ticket.service'
import { mentionChannel, mentionUser } from 'utils/mentions'

enum ButtonAction {
  CreateTicket = 1,
  CloseTicket,
  TranspileTicket,
}

export class InteractionCreate extends BaseEvent<'interactionCreate'> {
  _db = db
  constructor() {
    super('interactionCreate')
  }

  private parseButtonAction(
    id: string
  ):
    | { action: ButtonAction.CreateTicket; third: string }
    | { action: ButtonAction.CloseTicket; third: string }
    | { action: ButtonAction.TranspileTicket; third: string }
    | undefined {
    const parts = id.split('.')

    if (parts.at(0) === 'ticket' && parts.at(1) === 'create') {
      return {
        action: ButtonAction.CreateTicket,
        third: parts.at(2) as unknown as string,
      }
    }

    if (parts.at(0) === 'ticket' && parts.at(1) === 'close') {
      return {
        action: ButtonAction.CloseTicket,
        third: parts.at(2) as unknown as string,
      }
    }

    if (parts.at(0) === 'ticket' && parts.at(1) === 'transpile') {
      return {
        action: ButtonAction.TranspileTicket,
        third: parts.at(2) as unknown as string,
      }
    }
  }

  private getChannelClosedResponse = () => {
    const row = new ActionRowBuilder()
    const transpileButton = new ButtonBuilder()
      .setCustomId('ticket.transpile.channel')
      .setStyle(ButtonStyle.Success)
      .setEmoji('📃')

    row.addComponents(transpileButton)
    return row
  }

  private async handleConfirmCloseTicket(interaction: ButtonInteraction) {
    const channel = interaction.channel
    const interactionGuild = interaction.guild

    if (
      !channel ||
      !interactionGuild ||
      channel.type !== ChannelType.GuildText
    ) {
      return interaction.deferUpdate()
    }

    const [isAlreadyClosed] = await db.exec<{
      status?: string
    }>('SELECT status FROM tickets WHERE channel_id = $1 AND guild_id = $2', [
      interaction.channelId,
      interaction.guildId,
    ])

    if (!isAlreadyClosed || isAlreadyClosed.status === 'close') {
      return interaction.deferUpdate()
    }

    const channelDb = await this._db.getTicketById(
      channel.id,
      interactionGuild.id
    )

    if (!channelDb || channelDb.status !== TicketStatus.Open) {
      return interaction.deferUpdate()
    }

    const authorId = channelDb.author_id

    await channel.permissionOverwrites.create(authorId, {
      ViewChannel: false,
    })

    await db.closeTicket(channel.id, interactionGuild.id)

    const row = this.getChannelClosedResponse()

    await channel.send({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      components: [row],
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `This channel was closed by ${mentionUser(
              interaction.member?.user.id ?? ''
            )}`
          )
          .setFields([
            { name: 'Author', value: mentionUser(authorId) },
            {
              name: 'Opened at',
              value: new Date(channel.createdAt).toLocaleString(),
            },
          ])
          .setColor(Colors.Green),
      ],
    })

    await interaction.deferUpdate()
    if (interaction.message.deletable) {
      await interaction.message.delete()
    }
  }

  private async handleTranspileTicket(inetraction: ButtonInteraction) {
    const channel = inetraction.channel

    if (!channel || channel.type !== ChannelType.GuildText) {
      return
    }

    const html = await TicketService.transpileFromChannel(channel)

    const buffer = Buffer.from(html, 'utf-8')

    await channel.send({
      files: [
        {
          contentType: 'html',
          name: `${channel.name}.html`,
          attachment: buffer,
        },
      ],
    })
  }

  private async handleCancelTicketClose(interaction: ButtonInteraction) {
    const deletable = interaction.message.deletable

    if (!deletable) {
      return interaction.deferUpdate()
    }

    await interaction.message.delete()
  }
  private async handleButton(interaction: ButtonInteraction) {
    const parsedButton = this.parseButtonAction(interaction.customId)

    if (!parsedButton?.action) {
      return
    }

    switch (parsedButton.action) {
      case ButtonAction.TranspileTicket:
        await this.handleTranspileTicket(interaction)
        break
      case ButtonAction.CreateTicket:
        await this.handleCreateTicket(parsedButton.third, interaction)
        break
      case ButtonAction.CloseTicket:
        switch (parsedButton.third) {
          case 'channel':
            await this.handleCloseTicket(interaction)
            break
          case 'confirm':
            await this.handleConfirmCloseTicket(interaction)
            break
          case 'cancel':
            await this.handleCancelTicketClose(interaction)
            break
          default:
            break
        }
        break
      default:
        break
    }
  }

  private normalizeUsername(username: string) {
    return username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
  }

  private async getGuildChannel(guild: Guild, channelId: string | null) {
    if (!channelId) {
      return null
    }
    try {
      return await guild.channels.fetch(channelId)
    } catch (error) {
      return null
    }
  }

  private areUSureToClose() {
    const actionRowBuilder = new ActionRowBuilder().addComponents(
      new ButtonBuilder({
        customId: 'ticket.close.confirm',
        style: ButtonStyle.Success,
        emoji: '✔️',
      }),
      new ButtonBuilder({
        customId: 'ticket.close.cancel',
        style: ButtonStyle.Secondary,
        emoji: '✖️',
      })
    )

    return actionRowBuilder
  }

  private async handleCloseTicket(interaction: ButtonInteraction) {
    if (!interaction.channel || !interaction.guildId) {
      return interaction.deferUpdate()
    }
    const [isAlreadyClosed] = await db.exec<{
      status?: string
    }>('SELECT status FROM tickets WHERE channel_id = $1 AND guild_id = $2', [
      interaction.channelId,
      interaction.guildId,
    ])

    if (!isAlreadyClosed || isAlreadyClosed.status === 'close') {
      return interaction.deferUpdate()
    }

    const buttons = this.areUSureToClose()
    await interaction.channel
      .send({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        components: [buttons],
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `Are you sure to close the ticket ? ${mentionChannel(
                interaction.channelId
              )}\n\n⚠️ There is no revert back`
            )
            .setColor(Colors.Orange),
        ],
      })
      .finally(() => interaction.deferUpdate())
  }

  private async getMemberTicketsForGuild(memberId: string, guildId: string) {
    const query =
      'SELECT COUNT(*) FROM tickets WHERE author_id = $1 AND guild_id = $2 AND status = $3'
    const values = [memberId, guildId, TicketStatus.Open]

    const [res] = await this._db.exec<{ count: number }>(query, values)

    return res?.count ?? 0
  }

  public async replyOrEditReplyForInteraction(
    interaction: ButtonInteraction,
    options: InteractionReplyOptions
  ) {
    if (interaction.replied) {
      interaction.editReply(options)
    } else {
      interaction.reply(options)
    }
  }

  private async handleCreateTicket(
    buttonParsedId: string,
    interaction: ButtonInteraction
  ) {
    if (!interaction.guild) {
      return
    }

    const [interactionDB] = await db.exec<{
      message: string | null
      parent_id: string | null
    }>(
      `SELECT
        panel_interactions.parent_id AS parent_id,
        panels.message AS message
      FROM
        panel_interactions
      JOIN
        panels ON panel_interactions.panel_id = panels.id
      WHERE
        panel_interactions.id = $1`,
      [buttonParsedId]
    )

    if (!interactionDB) {
      return interaction.reply({
        content: `This interaction is not valid`,
        ephemeral: true,
      })
    }

    const memberActiveTickets = await this.getMemberTicketsForGuild(
      interaction.user.id,
      interaction.guild.id
    )

    const { max_each_user } = await TicketService.getFreshConfigOrCached(
      interaction.guild.id
    )

    if (memberActiveTickets >= max_each_user) {
      return interaction.reply({
        content: `You already reached the maximum tickets \`${max_each_user}\`, on this server`,
        ephemeral: true,
      })
    }

    const parentCategory = await this.getGuildChannel(
      interaction.guild,
      interactionDB.parent_id
    )

    if (!parentCategory || parentCategory.type !== ChannelType.GuildCategory) {
      return interaction.reply({
        content:
          "Couldn't open a ticket, contact the server support `INVALID_GUILD_CATEGORY`",
        ephemeral: true,
      })
    }

    const normalizedUsername = this.normalizeUsername(interaction.user.username)
    const userId = interaction.user.id

    const channel = await interaction.guild.channels.create({
      parent: interactionDB.parent_id,
      name: `ticket-${normalizedUsername}`,
      permissionOverwrites: [
        {
          id: userId,
          allow: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
      ],
    })

    await this._db.createTicket({
      author_id: userId,
      channel_id: channel.id,
      guild_id: channel.guildId,
      status: TicketStatus.Open,
    })

    const closeMessage = this.closeTicketMessage()

    const embedClose = new EmbedBuilder()
      .setDescription(
        `Welcome on your ticket ${mentionUser(
          userId
        )}\n\nTo close your please click on the \`🔒\` button`
      )
      .setColor(Colors.Green)

    await channel.send({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      components: [closeMessage],
      embeds: [embedClose],
    })

    return this.replyOrEditReplyForInteraction(interaction, {
      content: `Your ticket was opened ${mentionChannel(channel.id)}`,
      ephemeral: true,
    })
  }

  private closeTicketMessage() {
    const actionRowBuilder = new ActionRowBuilder().addComponents(
      new ButtonBuilder({
        customId: 'ticket.close.channel',
        style: ButtonStyle.Danger,
        emoji: '🔒',
      })
    )

    return actionRowBuilder
  }

  public async on(_: Client, interaction: Interaction) {
    if (interaction.isButton()) {
      await this.handleButton(interaction)
    }
  }
}
