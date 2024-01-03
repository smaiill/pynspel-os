import { Translation } from '@smaiill/trin'
import { TranslationBase } from '../types'

export const en: Translation<TranslationBase> = {
  subscription: {
    manage: 'Manage my subscription',
    monthly: {
      title: '1 month subscription',
      value: 'Monthly',
    },
    yearly: {
      title: '1 year subscription',
      value: 'Annualy',
    },
    finish_end_date:
      'Your subscription expires on {{ date }}, and you can renew it by clicking the button down.',
    active: 'Active',
    no_advantage_for_now:
      'Currently, you will have no benefit in purchasing the premium. As the project progresses, there will be advantages.',
  },
  actions: {
    add: 'Add',
    delete: 'Delete',
    save: 'Save',
    send: 'Send',
    update: 'Update',
    claim: 'Obtenir',
    modules: {
      updated: {
        fail: 'An error occurred while updating your module.',
        success: 'Module updated successfully.',
      },
    },
    confirm: 'Confirm',
    cancel: 'Cancel',
    select_channel: 'Select a channel',
  },
  pages: {
    dashboard: {
      manage_server: 'Manage',
      select_a_server: 'Select a Server',
    },
    guild: {
      welcome: 'Welcome to {{ name }}',
    },
    home: {
      add_pynspel: 'Add Pynspel',
      description:
        'Pynspel is a versatile Discord bot designed to assist users in securing and protecting their servers',
      go_to_dashboard: 'Go to Dashboard',
      nav: {
        dashboard: 'Dashboard',
        home: 'Home',
        login: 'Login',
      },
      serving_servers: 'Present on +{{ amount }} servers',
    },
  },
  modules: {
    captcha: {
      case_sensitive: 'Case Sensitive',
      channel: 'Channel where verification will take place',
      include_numbers: 'Include Numbers',
      kick_timeout: 'Time before excluding the user if no response',
      length: 'Captcha Length {{ choices }}',
      max_tries: 'Maximum Number of Tries',
      role_to_add: 'Role to add if the user has been verified',
    },
    command: {
      ban: 'Ban a Member',
      kick: 'Kick a User',
    },
    common: {
      action_to_take: 'Action to Take',
      mute_time: 'Mute Duration',
      mute_unit: 'Mute Unit',
      channels_ignore: 'Channels to Ignore',
      updated: 'Module updated',
    },
    counter_raid: {
      interval_to_activate:
        'The interval during which {{ members }} must join before activating the anti-raid',
      threshold: 'Number of members who must join within {{ time }} seconds',
      lock_channels:
        'Close all the channels, you will need to set back the permission s manually',
      action_raison: 'The raison of the action',
    },
    logging: {
      channel: 'Channel to send logs to',
      user_join: 'When a user joins',
      user_leave: 'When a user leaves',
    },
    scanner: {
      links: {
        activate: 'Activate link scanning',
        to_ban: 'Links to ban {{ ?.exact ? (Exact) : (Not exact)}}',
        authorized_domains: 'Domains to authorize',
      },
      words: {
        activate: 'Activate word scanning',
        to_ban: 'Words to ban {{ ?.exact ? (Exact) : (Not exact)}}',
      },
    },
    ticket: {
      create_panel_name: 'Panel Name',
      max_tickets:
        'Maximum number of tickets per member open simultaneously maximum ({{amount}})',
      panel: {
        channel: 'Channel to send the panel to',
        interactions: {
          button_label: 'Button Content',
          create: 'Create',
          title: 'Interactions',
          category: 'The category to open the ticket in',
        },
        message: 'Message to be sent with the panel',
        send_to_channel: 'Send to channel',
      },
      sure_to_delete: 'Are you sure you want to delete ?',
    },
    informations: {
      bot: {
        title: 'Bot',
        description:
          'Configures fundamental settings for the bot, including its name, status...',
      },
      captcha: {
        title: 'Captcha',
        description:
          'Manages settings related to captcha verification, such as captcha length, verification channel...',
      },
      command: {
        title: 'Commands',
        description: 'Enables or disables specific commands...',
      },
      counterRaid: {
        title: 'Counter Raid',
        description:
          'Implements features to detect and counter potential attacks, including member threshold, detection interval...',
      },
      logging: {
        title: 'Logging',
        description:
          'Manages logging configurations, allowing customization of the logging channel...',
      },
      scanner: {
        title: 'Logging',
        description: 'Configures word and link scanning settings...',
      },
      ticket: {
        title: 'Logging',
        description:
          'Controls settings related to tickets, including panels...',
      },
    },
  },
  common: {
    empty: 'Empty',
    operation: {
      success: 'Operation success',
    },
    back: 'Back',
  },
  errors: {
    E_V_NAME_OR_EMOJI: 'You need to at least have an emoji or a name',
    E_GENERIC: 'An error occurred. Please retry in a moment.',
  },
}
