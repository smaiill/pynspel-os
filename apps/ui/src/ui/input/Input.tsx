import { ForwardedRef, forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { css } from '../../../styled-system/css'

const wrapper = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '7.5px',
  width: '100%',

  '& label': {
    color: 'grey',
    fontSize: '13px',
    marginLeft: '5px',
  },
})

const body = css({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  gap: '10px',
  borderRadius: '10px',
  justifyContent: 'space-between',
  transition: '0.3s',
  backgroundColor: '#2b2929',

  '&:has(input:focus)': {
    transition: '0',
    outline: '1px solid rgb(77, 76, 76)',
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
  error?: boolean
}

const Input = forwardRef(
  (props: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
    const { icon, className, label, error, onIconClick, ...rest } = props

    return (
      <div className={wrapper}>
        {label && <label htmlFor="input">{label}</label>}
        <div style={error ? { border: '1px solid red' } : {}} className={body}>
          <input
            className={className}
            spellCheck="false"
            ref={ref}
            placeholder={label}
            {...rest}
          />

          {icon && <div onClick={onIconClick}>{icon}</div>}
        </div>
      </div>
    )
  }
)

export { Input }
