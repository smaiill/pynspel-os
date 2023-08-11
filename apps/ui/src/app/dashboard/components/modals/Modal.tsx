import { X } from 'lucide-react'
import React, { HTMLAttributes, PropsWithChildren } from 'react'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'
import { RecipeVariantProps, css, cva } from '../../../../../styled-system/css'
import { createPortal } from 'react-dom'

const modalRecipe = cva({
  base: {
    padding: '15px',
    rounded: '15px',
    maxW: '500px',
  },
  variants: {
    visual: {
      danger: {
        border: '1px solid red.200',
      },
      normal: {
        border: '1px solid rgb(77, 76, 76)',
        bg: '#333131',
      },
    },
  },
})

type ModalVariants = RecipeVariantProps<typeof modalRecipe>

type ModalVisual = Exclude<
  ModalVariants extends infer AV
    ? AV extends object
      ? AV[keyof AV & 'visual']
      : never
    : never,
  undefined
>

type ModalProps = {
  onClose?: () => void
  visual?: ModalVisual
}

export const Modal = (props: PropsWithChildren<ModalProps>) => {
  const { children, visual = 'normal' } = props
  return createPortal(
    <div
      className={css({
        position: 'fixed',
        translate: '-50% -50%',
        top: '50%',
        left: '50%',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bg: 'rgba(0, 0, 0, .3)',
      })}
    >
      <FlexColumn className={modalRecipe({ visual })}>{children}</FlexColumn>
    </div>,
    document.body
  )
}

type HeaderProps = {
  title?: string
  description?: string
  closable?: boolean
}

const Header = (props: HeaderProps) => {
  const { title, description, closable } = props
  return (
    <header>
      <FlexColumn>
        {title && <Typography as="h5">{title}</Typography>}
        {description && (
          <Typography className={css({ mt: '5px' })} color="secondary" as="p">
            {description}{' '}
          </Typography>
        )}
      </FlexColumn>
      {closable && <X />}
    </header>
  )
}

const Content = ({
  children,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return <div {...rest}>{children}</div>
}

const Footer = ({
  children,
  style,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <Flex
      {...rest}
      style={{
        alignItems: 'center',
        gap: '5px',
        justifyContent: 'flex-end',
        marginTop: '30px',
        ...style,
      }}
    >
      {children}
    </Flex>
  )
}

Modal.Header = Header
Modal.Content = Content
Modal.Footer = Footer
