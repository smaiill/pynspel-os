import { PropsWithChildren } from 'react'
import { Footer } from '~/components/footer/Footer'
import { MainHeader } from '~/components/header/main/MainHeader'

export const HeaderAndFooterLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <MainHeader />
      {children}
      <Footer />
    </>
  )
}
