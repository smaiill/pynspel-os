import { HTMLAttributes, PropsWithChildren } from 'react'

export type IFlexLayout = HTMLAttributes<HTMLDivElement>

const FlexColumn = (props: PropsWithChildren<IFlexLayout>) => {
  const { children, style, ...rest } = props
  return (
    <Flex {...rest} style={{ ...style, flexDirection: 'column' }}>
      {children}
    </Flex>
  )
}

const Flex = (props: PropsWithChildren<IFlexLayout>) => {
  const { children, style, ...rest } = props
  return (
    <div style={{ ...style, display: 'flex' }} {...rest}>
      {children}
    </div>
  )
}

export { FlexColumn, Flex }
