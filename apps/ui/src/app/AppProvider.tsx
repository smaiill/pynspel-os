import { PropsWithChildren } from 'react'

export const AppProvider = (props: PropsWithChildren) => {
  const { children } = props

  return children
}
