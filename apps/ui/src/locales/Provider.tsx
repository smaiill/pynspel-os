import { setLocale } from '@smaiill/trin'
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { t } from './index'

const TranslationContext = createContext({
  t,
  update: (locale: string) => locale,
  locale: null as unknown as string,
})

export const useTranslation = () => {
  const { t, update, locale } = useContext(TranslationContext)
  return { t, update, locale }
}

export const TranslationProvider = ({ children }: PropsWithChildren) => {
  const [value, setLocaleValue] = useLocalStorage('locale', 'en')
  const [_sideEffect, _setSideEffect] = useState(false)

  const update = (locale: string) => {
    setLocale(locale)
    setLocaleValue(locale)
    _setSideEffect(!_sideEffect)

    return locale
  }

  useEffect(() => {
    update(value)
  }, [])

  return (
    <TranslationContext.Provider value={{ t, update, locale: value }}>
      {children}
    </TranslationContext.Provider>
  )
}
