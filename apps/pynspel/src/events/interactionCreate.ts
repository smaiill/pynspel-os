import { BaseEvent } from '@pynspel/px'
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
  PermissionFlagsBits,
} from 'discord.js'
import { TicketService } from 'modules/ticket/ticket.service'

enum ButtonAction {
  CreateTicket = 1,
  CloseTicket = 2,
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

    if (!channel) {
      return
    }

    const row = this.getChannelClosedResponse()

    const message = await channel.send({
      content: 'Channel closed',
      components: [row],
    })

    // TODO: Remove permissions to the user who created the channel.
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
      // TODO: Check if user can create the ticket.
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
    return username.trim().toLowerCase().replace(/\s+/g, '_')
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

  private async handleCreateTicket(
    buttonParsedId: string,
    interaction: ButtonInteraction
  ) {
    const [interactionDB] = await db.exec<{
      id: string
      name: string
      parent_id: string | null
      panel_id: string
    }>(
      // 'SELECT * FROM panel_interactions JOIN panels ON panel_interactions.panel_id = panels.id WHERE panel_interactions.id = $1',
      'SELECT * FROM panel_interactions WHERE id = $1',
      [buttonParsedId]
    )

    if (!interaction.guild?.available) {
      return console.log('Invalid guild !')
    }

    const parentCategory = await this.getGuildChannel(
      interaction.guild,
      interactionDB.parent_id
    )

    if (parentCategory && parentCategory.type !== ChannelType.GuildCategory) {
      return console.log('Not a category')
    }

    const normalizedUsername = this.normalizeUsername(interaction.user.username)

    if (!parentCategory) {
      const channel = await interaction.guild.channels.create({
        name: `ticket-${normalizedUsername}`,
        permissionOverwrites: [
          {
            id: interaction.user.id,
            allow: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionFlagsBits.ViewChannel],
          },
        ],
      })

      const closeMessage = this.closeTicketMessage()

      const res = await channel.send({
        content: 'Hello world',
        components: [closeMessage],
      })

      return
    }

    const channel = await interaction.guild.channels.create({
      parent: parentCategory,
      name: `ticket-${normalizedUsername}`,
      permissionOverwrites: [
        {
          id: interaction.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.guild.roles.everyone,
          deny: [PermissionFlagsBits.ViewChannel],
        },
      ],
    })

    const closeMessage = this.closeTicketMessage()

    await channel.send({
      content: 'Hello world',
      components: [closeMessage],
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
