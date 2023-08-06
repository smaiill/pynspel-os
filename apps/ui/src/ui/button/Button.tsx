import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
} from 'react'
import { buttonRecipe, ButtonVariants } from '~/theme/button.recipe'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variants: ButtonVariants
  href?: string
}

export const Button = forwardRef(
  (
    props: PropsWithChildren<ButtonProps>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const { children, variants, href, onClick, ...rest } = props

    const handleClick = (e: any) => {
      href && window.open(href)
      onClick && onClick(e)
    }

    return (
      <button
        {...rest}
        ref={ref}
        className={buttonRecipe({ visual: variants?.visual })}
        onClick={handleClick}
      >
        {children}
      </button>
    )
  }
)

export const ButtonPrimary = forwardRef(
  (
    props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return <Button {...props} ref={ref} variants={{ visual: 'primary' }} />
  }
)

export const ButtonDanger = forwardRef(
  (
    props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return <Button {...props} ref={ref} variants={{ visual: 'danger' }} />
  }
)

export const ButtonSuccess = forwardRef(
  (
    props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return <Button {...props} ref={ref} variants={{ visual: 'success' }} />
  }
)

export const ButtonWarn = forwardRef(
  (
    props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return <Button {...props} ref={ref} variants={{ visual: 'warn' }} />
  }
)

export const ButtonSpecial = forwardRef(
  (
    props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    return <Button {...props} ref={ref} variants={{ visual: 'special' }} />
  }
)
