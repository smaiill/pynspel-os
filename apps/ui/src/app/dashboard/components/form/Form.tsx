import { FormHTMLAttributes, PropsWithChildren } from 'react'

const Form = (
  props: PropsWithChildren<FormHTMLAttributes<HTMLFormElement>>
) => {
  const { children, ...rest } = props

  return <form {...rest}>{children}</form>
}

export { Form }
