import React, {
  Dispatch,
  ForwardedRef,
  InputHTMLAttributes,
  PropsWithChildren,
  SetStateAction,
  forwardRef,
} from 'react'
import { FlexColumn } from '~/layouts/Flex'
import { css } from '../../../styled-system/css'

type Props = InputHTMLAttributes<HTMLInputElement>

const checkboxWrapper = css({
  alignItems: 'flex-start',
  '& label': {
    color: 'grey',
    fontSize: '13px',
    marginLeft: '5px',
  },

  '& input': {
    marginLeft: '5px',
    marginTop: '5px',
    width: '20px',
    height: '20px',
  },
})

const Checkbox = forwardRef(
  (props: PropsWithChildren<Props>, ref: ForwardedRef<HTMLInputElement>) => {
    const { children, value, ...rest } = props
    return (
      <FlexColumn className={checkboxWrapper}>
        <label htmlFor="checkbox">{children}</label>
        <input type="checkbox" ref={ref} {...rest} checked={value} />
      </FlexColumn>
    )
  }
)

export { Checkbox }
