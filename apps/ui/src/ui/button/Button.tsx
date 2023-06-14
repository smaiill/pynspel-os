'use client'

import { clsx } from 'clsx'
import {
  ButtonHTMLAttributes,
  ForwardedRef,
  forwardRef,
  PropsWithChildren,
} from 'react'
import style from './button.module.scss'

export type IButtonTypes = 'primary' | 'danger' | 'success' | 'warn' | 'special'

export interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  _type: IButtonTypes
  prefixElement?: JSX.Element
  suffixElement?: JSX.Element
  loading?: boolean
  href?: string
}

export type ForwardButton = Omit<IButton, '_type'>

const Button = forwardRef(
  (props: PropsWithChildren<IButton>, ref: ForwardedRef<HTMLButtonElement>) => {
    const {
      children,
      prefixElement,
      suffixElement,
      className,
      _type,
      loading,
      href,
      ...rest
    } = props

    const handleClick = () => {
      href && window.open(href, '_self')
    }

    return (
      <button
        className={clsx(
          style.btn,
          style[_type],
          loading ? style.loading : '',
          className
        )}
        ref={ref}
        onClick={handleClick}
        {...rest}
      >
        {prefixElement}
        {children}
        {suffixElement}
      </button>
    )
  }
)

export const ButtonPrimary = forwardRef(
  (props: ForwardButton, ref: ForwardedRef<HTMLButtonElement>) => {
    return <Button {...props} ref={ref} _type="primary" />
  }
)

export const ButtonDanger = forwardRef(
  (props: ForwardButton, ref: ForwardedRef<HTMLButtonElement>) => {
    return <Button {...props} ref={ref} _type="danger" />
  }
)

export const ButtonSuccess = forwardRef(
  (props: ForwardButton, ref: ForwardedRef<HTMLButtonElement>) => {
    return <Button {...props} ref={ref} _type="success" />
  }
)

export const ButtonWarn = forwardRef(
  (props: ForwardButton, ref: ForwardedRef<HTMLButtonElement>) => {
    return <Button {...props} ref={ref} _type="warn" />
  }
)

export const ButtonSpecial = forwardRef(
  (props: ForwardButton, ref: ForwardedRef<HTMLButtonElement>) => {
    return <Button {...props} ref={ref} _type="special" />
  }
)
