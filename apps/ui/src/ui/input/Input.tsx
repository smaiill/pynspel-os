import { ForwardedRef, forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { FieldError } from '~/app/dashboard/components/form/FieldError'
import { css, cx } from '../../../styled-system/css'
import { Label } from '../Label'

const wrapper = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '7.5px',
  width: '100%',
})

const body = css({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  gap: '10px',
  justifyContent: 'space-between',
  transition: '0.3s',
  backgroundColor: 'news.backgrounds.tertiary',
  border: 'news.tertiary',

  '&:has(input:focus)': {
    transition: '0',
  },

  '& p': {
    fontSize: '10px',
    cursor: 'pointer',
    fontWeight: '900',
    color: 'grey',
  },

  '& input': {
    color: 'white',
    height: '30px',
    background: 'none',
    border: 'none',
    flex: '1',

    '&::placeholder': {
      color: 'news.fonts.label',
    },

    '&[type=number]::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
    },

    '&:focus': {
      outline: 'none',
    },
  },
})

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: JSX.Element
  label?: string
  onIconClick?: () => void
  _prefix?: ReactNode
  _suffix?: ReactNode
  error?: string
  classNameWrapper?: string
}

const Input = forwardRef(
  (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
      icon,
      className,
      label,
      error,
      onIconClick,
      classNameWrapper,
      required,
      ...rest
    } = props

    return (
      <div
        className={css({ display: 'flex', flexDir: 'column', width: '100%' })}
      >
        <div className={cx(wrapper, classNameWrapper)}>
          {label && <Label required={required}>{label}</Label>}
          <div
            style={error ? { border: '1px solid var(--colors-red-500)' } : {}}
            className={body}
          >
            <input
              className={cx(className)}
              spellCheck="false"
              ref={ref}
              placeholder={label}
              {...rest}
            />

            {icon && <div onClick={onIconClick}>{icon}</div>}
          </div>
        </div>
        {error ? <FieldError message={error} /> : null}
      </div>
    )
  }
)

export { Input }
