import { PropsWithChildren } from 'react'
import { css } from '../../../../../styled-system/css'

type Props = {
  message?: string
}

const errorCss = css({
  color: 'red.500',
  marginTop: '5px',
  fontSize: 'sm',
  fontWeight: 300,
})

const FieldError = (props: PropsWithChildren<Props>) => {
  const { message, children } = props

  return (
    <div className={errorCss}>
      {message
        ? message
        : children
        ? children
        : "Une erreur s'est produite a ce niveau"}
    </div>
  )
}

export { FieldError }
