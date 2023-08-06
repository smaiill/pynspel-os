import { css } from '../../../../../styled-system/css'

type Props = {
  message?: string
}

const errorCss = css({
  color: '#ef4444',
  marginTop: '5px',
})

const FieldError = (props: Props) => {
  const { message } = props

  return (
    <div className={errorCss}>
      {message ? message : "Une erreur s'est produite ici"}
    </div>
  )
}

export { FieldError }
