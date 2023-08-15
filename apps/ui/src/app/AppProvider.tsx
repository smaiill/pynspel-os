import { PropsWithChildren } from 'react'
import { TranslationProvider } from '~/locales/Provider'

export const AppProvider = (props: PropsWithChildren) => {
  const { children } = props

  return <TranslationProvider>{children}</TranslationProvider>
}
