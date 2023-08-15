import { createTranslation } from '@smaiill/trin'
import { en, fr } from './translations'
import { TranslationBase } from './types'

export const { t } = createTranslation<TranslationBase>(
  { fr, en },
  { locale: 'en' }
)
