import {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  PropsWithChildren,
} from 'react'
import { FlexColumn } from '~/layouts/Flex'
import { css } from '../../../styled-system/css'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  styles?: {
    label: string
  }
}

const checkboxWrapper = css({
  alignItems: 'flex-start',
  gap: 5,
  '& label': {
    color: 'grey',
    fontSize: '13px',
  },
})

const wrapperStyle = css({
  display: 'flex',
  width: '55px',
  height: '25px',
  position: 'relative',
  rounded: '10px',
  overflow: 'hidden',
  border: '1px solid rgb(77, 76, 76)',
  cursor: 'pointer !important',

  '&:has(input:checked)': {
    '& span': {
      bgColor: 'special !important',

      _before: {
        left: '63% !important',
      },
    },
  },

  '& input': {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    zIndex: 100,
    opacity: 0,
    cursor: 'pointer !important',
  },

  '& span': {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    bgColor: '#2B2929',
    padding: '3px',
    transition: '.3s',
    cursor: 'pointer !important',

    _before: {
      content: '""',
      position: 'absolute',
      width: '18px',
      height: '70%',
      bgColor: 'white',
      rounded: '10px',
      translate: '0 -50%',
      top: '50%',
      transition: '.3s',
      left: '3px',
    },
  },
})

const Checkbox = forwardRef(
  (props: PropsWithChildren<Props>, ref: ForwardedRef<HTMLInputElement>) => {
    const { children, value, styles, ...rest } = props

    return (
      <FlexColumn className={checkboxWrapper}>
        <label className={styles?.label} htmlFor="checkbox">
          {children}
        </label>
        <div className={wrapperStyle}>
          <input type="checkbox" ref={ref} {...rest} checked={value} />
          <span />
        </div>
      </FlexColumn>
    )
  }
)

export { Checkbox }
