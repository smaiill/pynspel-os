import { Crown } from 'lucide-react'
import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
} from 'react'
import { buttonRecipe, ButtonVariants } from '~/theme/button.recipe'
import { cx } from '../../../styled-system/css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variants: ButtonVariants
  href?: string
}

type ButtonChildProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement>
> &
  Pick<ButtonProps, 'href'>

export const Button = forwardRef(
  (
    props: PropsWithChildren<ButtonProps>,
    ref: ForwardedRef<HTMLButtonElement>
  ) => {
    const { children, variants, href, onClick, className, ...rest } = props

    const handleClick = (e: any) => {
      href && window.open(href)
      onClick && onClick(e)
    }

    return (
      <button
        {...rest}
        ref={ref}
        className={cx(
          buttonRecipe({
            visual: variants?.visual,
            format: variants?.format
          }),
          className
        )}
        onClick={handleClick}
      >
        {children}
      </button>
    )
  }
)

export const ButtonPrimary = forwardRef(
  (props: ButtonChildProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return (
      <Button
        {...props}
        ref={ref}
        variants={{ visual: 'primary', format: 'normal' }}
      />
    )
  }
)

export const ButtonDanger = forwardRef(
  (props: ButtonChildProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return (
      <Button
        {...props}
        ref={ref}
        variants={{ visual: 'danger', format: 'normal' }}
      />
    )
  }
)

export const ButtonSuccess = forwardRef(
  (props: ButtonChildProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return (
      <Button
        {...props}
        ref={ref}
        variants={{ visual: 'success', format: 'normal' }}
      />
    )
  }
)

export const ButtonWarn = forwardRef(
  (props: ButtonChildProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return (
      <Button
        {...props}
        ref={ref}
        variants={{ visual: 'warn', format: 'normal' }}
      />
    )
  }
)

export const ButtonSpecial = forwardRef(
  (props: ButtonChildProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return (
      <Button
        {...props}
        ref={ref}
        variants={{ visual: 'special', format: 'normal' }}
      />
    )
  }
)
export const ButtonPremium = forwardRef(
  (props: ButtonChildProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const { children, ...rest } = props

    return (
      <Button
        {...rest}
        ref={ref}
        variants={{ visual: 'premium', format: 'normal' }}
      >
        <Crown size={17} />
        {children}
      </Button>
    )
  }
)

export const ButtonOutline = forwardRef(
  (props: ButtonChildProps, ref: ForwardedRef<HTMLButtonElement>) => {
    return (
      <Button
        {...props}
        ref={ref}
        variants={{ visual: 'outline', format: 'normal' }}
      />
    )
  }
)
