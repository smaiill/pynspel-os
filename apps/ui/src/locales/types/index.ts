import { ActionsTranslationBase } from './actions'
import { DashboardTranslationBase } from './dashboard'
import { GuildTranslationBase } from './guild'
import { HomeTranslationBase } from './home'
import { ModulesTranslationBase } from './modules'

/* eslint-disable */
export type TranslationBase = {
  pages: {
    home: HomeTranslationBase
    dashboard: DashboardTranslationBase
    guild: GuildTranslationBase
  }
  modules: ModulesTranslationBase
  actions: ActionsTranslationBase
  subscription: {
    manage: {}
    yearly: {
      title: {}
      value: {}
    }
    monthly: {
      title: {}
      value: {}
    }
    finish_end_date: {
      date: string
    }
    active: {}
  }
  common: {
    empty: {}
  }
  errors: {
    E_V_NAME_OR_EMOJI: {}
  }
}
