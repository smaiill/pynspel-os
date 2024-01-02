import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  PropsWithChildren,
} from 'react'
import { FlexColumn } from '~/layouts/Flex'
import { css } from '../../../styled-system/css'
import { Label } from '../Label'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  styles?: {
    label: string
  }
  size?: number
}

const checkboxWrapper = css({
  alignItems: 'flex-start',
  gap: 5,
})

const wrapperStyle = css({
  display: 'flex',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgb(77, 76, 76)',
  cursor: 'pointer !important',

  '&:has(input:checked)': {
    '& span': {
      bg: 'special',

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
    bgColor: 'news.backgrounds.tertiary',
    padding: '3px',
    transition: '.3s',
    cursor: 'pointer !important',

    _before: {
      content: '""',
      position: 'absolute',
      // width: '18px',
      height: '70%',
      bg: 'white',
      translate: '0 -50%',
      top: '50%',
      transition: '.3s',
      left: '3px',
    },
  },
})

const Checkbox = forwardRef(
  (props: PropsWithChildren<Props>, ref: ForwardedRef<HTMLInputElement>) => {
    const { children, styles, size = 1, required, ...rest } = props
    const sizes = {
      wrapperWidth: `${55 * size}px`,
      wrapperHeight: `${25 * size}px`,
      beforeSize: `${18 * size}px`,
    }

    return (
      <FlexColumn className={checkboxWrapper}>
        <Label required={required} className={styles?.label}>
          {children}
        </Label>
        <div
          style={{ width: sizes.wrapperWidth, height: sizes.wrapperHeight }}
          className={wrapperStyle}
        >
          <input type="checkbox" ref={ref} {...rest} />
          <span
            style={
              {
                '--checkbox-before-width': sizes.beforeSize,
              } as CSSProperties
            }
            className="__checkbox_before"
          />
        </div>
      </FlexColumn>
    )
  }
)

export { Checkbox }
