import { Translation } from '@smaiill/trin'
import { TranslationBase } from '../types'

export const fr: Translation<TranslationBase> = {
  subscription: {
    manage: 'Gèrer mon abonnement',
    monthly: {
      title: 'Abonnement de 1 mois',
      value: 'Mensuel',
    },
    yearly: {
      title: 'Abonnement de 1 an',
      value: 'Annuel',
    },
    finish_end_date:
      'Votre abonnement prend fin le {{ date }}, vous pouvez le reprendre en cliquant sur le bouton ci dessus.',
    active: 'Actif',
    no_advantage_for_now:
      "Actuellement, vous n'aurez aucun avantage à acheter le premium. Au fur et à mesure que le projet avance, il y aura des avantages.",
  },
  actions: {
    add: 'Ajouter',
    delete: 'Supprimer',
    save: 'Sauvegarder',
    send: 'Envoyer',
    update: 'Mettre à jour',
    claim: 'Obtenir',
    modules: {
      updated: {
        fail: "Une erreur s'est produite lors de la mise à jour de votre module.",
        success: 'Module mis à jour avec succès.',
      },
    },
    confirm: 'Confirmer',
    cancel: 'Annuler',
    select_channel: 'Selectionne un channel',
  },
  pages: {
    dashboard: {
      manage_server: 'Gérer',
      select_a_server: 'Sélectionner un serveur',
    },
    guild: {
      welcome: 'Bienvenue sur {{ name }}',
    },
    home: {
      add_pynspel: 'Ajouter Pynspel',
      description:
        'Pynspel est un bot Discord polyvalent conçu pour aider les utilisateurs à sécuriser et protéger leurs serveurs.',
      go_to_dashboard: 'Aller au tableau de bord',
      nav: {
        dashboard: 'Tableau de bord',
        home: 'Accueil',
        login: 'Se connecter',
      },
      serving_servers: 'Présent sur +{{ amount }} serveurs.',
    },
  },
  modules: {
    captcha: {
      case_sensitive: 'Sensible à la casse',
      channel: 'Salon où aura lieu la vérification',
      include_numbers: 'Inclure des nombres',
      kick_timeout:
        "Temps avant d'exclure l'utilisateur en cas d'absence de réponse",
      length: 'Taille du captcha {{ choices }}',
      max_tries: "Nombre d'essais maximum",
      role_to_add: "Rôle à ajouter si l'utilisateur a été vérifié.",
    },
    command: {
      ban: 'Bannir un membre',
      kick: 'Exclure un utilisateur',
    },
    common: {
      action_to_take: 'Action à prendre',
      mute_time: 'Durée du mute',
      mute_unit: 'Unité du mute',
      channels_ignore: 'Les salons à ignorer',
      updated: 'Module mis a jour',
    },
    counter_raid: {
      interval_to_activate:
        "L'intervalle pendant lequel {{ members }} doivent rejoindre avant d'activer l'anti-raid",
      threshold:
        'Nombre de membres qui doivent rejoindre en {{ time }} secondes',
      lock_channels:
        'Fermer tout les salons, Attention il faudra remettre les permissions manuellement',
      action_raison: 'Raison indiqué',
    },
    logging: {
      channel: 'Salon sur lequel envoyer les logs',
      user_join: 'Quand un utilisateur rejoint',
      user_leave: 'Quand un utilisateur quitte',
    },
    scanner: {
      links: {
        activate: 'Activer la vérification des liens',
        to_ban: 'Les liens à bannir {{ ?.exact ? (Exact) : (Non exact)}}',
        authorized_domains: 'Les domaines a autorisé',
      },
      words: {
        activate: 'Activer la vérification des mots',
        to_ban: 'Les mots à bannir {{ ?.exact ? (Exact) : (Non exact)}}',
      },
    },
    ticket: {
      create_panel_name: 'Nom du panneau de création',
      max_tickets:
        'Nombre maximal de tickets par membre ouverts simultanément maximum ({{amount}})',
      panel: {
        channel: 'Salon où envoyer le panneau',
        interactions: {
          button_label: 'Libellé du bouton',
          create: 'Créer',
          title: 'Interactions',
          category: 'La catégorie dans laquel ouvrir le ticket',
        },
        message: 'Message qui sera envoyé avec le panneau',
        send_to_channel: 'Envoyer dans le channel',
      },
      sure_to_delete: 'Vous etes sure de vouloir supprimer ?',
    },
    informations: {
      bot: {
        title: 'Bot',
        description:
          'Configure les paramètres fondamentaux du bot, y compris son nom, son statut...',
      },
      captcha: {
        title: 'Captcha',
        description:
          'Gère les paramètres liés à la vérification captcha, tels que la longueur du captcha, le canal de vérification...',
      },
      command: {
        title: 'Commandes',
        description: 'Active ou désactive des commandes spécifiques...',
      },
      counterRaid: {
        title: 'Counter Raid',
        description:
          "Implémente des fonctionnalités pour détecter et contrer d'éventuelles attaques, comprenant le seuil de membres, l'intervalle de détection...",
      },
      logging: {
        title: 'Logging',
        description:
          'Gère les configurations de journalisation, permettant la personnalisation du canal de journalisation...',
      },
      scanner: {
        title: 'Logging',
        description:
          'Configure les paramètres de balayage de mots et de liens...',
      },
      ticket: {
        title: 'Logging',
        description: 'Contrôle les paramètres liés aux tickets, les panels...',
      },
    },
  },
  common: {
    empty: 'Vide',
  },
  errors: {
    E_V_NAME_OR_EMOJI: 'Vous devez au moins avoir un nom ou un emoji',
    E_GENERIC: "Une erreur s'est produite réssayer",
  },
}
