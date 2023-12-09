import { PropsWithChildren } from 'react'
import { Footer } from '~/components/footer/Footer'

export const FooterLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      {children}
      <Footer />
    </>
  )
}
