import {
  ForwardedRef,
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
} from 'react'

export type IFlexLayout = HTMLAttributes<HTMLDivElement>

const FlexColumn = forwardRef(
  (
    props: PropsWithChildren<IFlexLayout>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { children, style, ...rest } = props
    return (
      <Flex {...rest} ref={ref} style={{ ...style, flexDirection: 'column' }}>
        {children}
      </Flex>
    )
  }
)

const Flex = forwardRef(
  (
    props: PropsWithChildren<IFlexLayout>,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { children, style, ...rest } = props
    return (
      <div style={{ ...style, display: 'flex' }} {...rest} ref={ref}>
        {children}
      </div>
    )
  }
)

export { FlexColumn, Flex }
