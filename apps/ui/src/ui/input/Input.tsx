import { ForwardedRef, forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import style from './input.module.scss'

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  icon?: JSX.Element
  label?: string
  onIconClick?: () => void

  _prefix?: ReactNode
  _suffix?: ReactNode
}

const Input = forwardRef(
  (props: IInput, ref: ForwardedRef<HTMLInputElement>) => {
    const { icon, className, label, onIconClick, ...rest } = props

    return (
      <div className={style.wrapper}>
        {label && <label htmlFor="input">{label}</label>}
        <div className={style.body}>
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
