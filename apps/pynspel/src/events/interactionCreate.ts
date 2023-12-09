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
  Guild,
  Interaction,
  InteractionReplyOptions,
  PermissionFlagsBits,
} from 'discord.js'
import { TicketService } from 'modules/ticket/ticket.service'
import { mentionChannel } from 'utils/mentions'

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
      .setLabel('Transpile')
      .setStyle(ButtonStyle.Primary)

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
      return
    }

    const channelDb = await this._db.getTicketById(
      channel.id,
      interactionGuild.id
    )

    if (!channelDb || channelDb.status !== TicketStatus.Open) {
      return
    }

    const authorId = channelDb.author_id

    await channel.permissionOverwrites.create(authorId, {
      ViewChannel: false,
    })

    await db.closeTicket(channel.id, interactionGuild.id)

    const row = this.getChannelClosedResponse()

    await channel.send({
      content: 'Channel closed',
      components: [row],
    })
  }

  private async handleTranspileTicket(
    thirdAction: string,
    inetraction: ButtonInteraction
  ) {
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
      return
    }

    await interaction.message.delete()
  }
  private handleButton(interaction: ButtonInteraction) {
    const parsedButton = this.parseButtonAction(interaction.customId)

    if (!parsedButton?.action) {
      return
    }

    switch (parsedButton.action) {
      case ButtonAction.TranspileTicket:
        this.handleTranspileTicket(parsedButton.third, interaction)
        break
      case ButtonAction.CreateTicket:
        this.handleCreateTicket(parsedButton.third, interaction)
        break
      case ButtonAction.CloseTicket:
        switch (parsedButton.third) {
          case 'channel':
            this.handleCloseTicket(interaction)
            break
          case 'confirm':
            this.handleConfirmCloseTicket(interaction)
            break
          case 'cancel':
            this.handleCancelTicketClose(interaction)
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
        label: 'Confirm',
        style: ButtonStyle.Primary,
      }),
      new ButtonBuilder({
        customId: 'ticket.close.cancel',
        label: 'Cancel',
        style: ButtonStyle.Primary,
      })
    )

    return actionRowBuilder
  }

  private async handleCloseTicket(interaction: ButtonInteraction) {
    if (!interaction.channel) {
      return
    }

    const buttons = this.areUSureToClose()
    await interaction.channel
      .send({
        content: 'Are you sure ?',
        components: [buttons],
      })
      .catch((err) => {
        console.log(JSON.stringify(err, null, 2))
      })
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
      return console.log('Invalid guild !')
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
        content: `Invalid interaction`,
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

    if (parentCategory && parentCategory.type !== ChannelType.GuildCategory) {
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

    await channel.send({
      content: interactionDB.message ?? undefined,
      components: [closeMessage],
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
        label: 'Close',
        style: ButtonStyle.Primary,
      })
    )

    return actionRowBuilder
  }

  public async on(client: Client, interaction: Interaction) {
    interaction.isButton() && this.handleButton(interaction)
  }
}
