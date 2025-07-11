/* eslint-disable */

import { ModulesTypes } from '@pynspel/common'

export type ModulesTranslationBase = {
  common: {
    action_to_take: {}
    mute_time: {}
    mute_unit: {}
    channels_ignore: {}
    updated: {}
  }
  captcha: {
    length: {
      choices: string
    }
    max_tries: {}
    role_to_add: {}
    kick_timeout: {}
    channel: {}
    include_numbers: {}
    case_sensitive: {}
  }
  logging: {
    channel: {}
    user_join: {}
    user_leave: {}
  }
  ticket: {
    max_tickets: {
      amount: number
    }
    create_panel_name: {}
    panel: {
      message: {}
      channel: {}
      interactions: {
        title: {}
        create: {}
        button_label: {}
        category: {}
      }
      send_to_channel: {}
    }
    sure_to_delete: {}
  }
  command: {
    ban: {}
    kick: {}
  }
  scanner: {
    words: {
      activate: {}
      to_ban: {
        exact: boolean
      }
    }
    links: {
      activate: {}
      to_ban: {
        exact: boolean
      }
      authorized_domains: {}
    }
  }
  counter_raid: {
    threshold: {
      time: number
    }
    interval_to_activate: {
      members: number
    }
    action_raison: {}
    lock_channels: {}
  }
  informations: {
    [K in ModulesTypes]: {
      title: {}
      description: {}
    }
  }
}
