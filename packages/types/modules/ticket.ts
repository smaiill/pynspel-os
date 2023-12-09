type DiscordButtonStyle = 1 | 2 | 3 | 4

export type Interaction = {
  emoji: null | string
  id: string
  name: string | null
  panel_id: string
  parent_id: string | null
  style: DiscordButtonStyle
}

export type PanelApi = {
  id: string
  name: string
  guild_id: string
  message: null | string
  channel_id: string | null
  interactions: Interaction[]
}

export type InteractionCreatedApi = {
  id: string
  name: string | null
  parent_id: string | null
  panel_id: string
  emoji: string | null
  style: DiscordButtonStyle
}

export enum TicketStatus {
  Open = 'open',
  Closed = 'close',
}

export type Ticket = {
  channel_id: string
  author_id: string
  guild_id: string
  status: TicketStatus
}

export type SavedTicket = Ticket & { id: string }
