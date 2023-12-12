import { HTMLAttributes, MutableRefObject, PropsWithChildren } from 'react'
import { useEventListener } from 'usehooks-ts'
import { css, cx } from '../../../styled-system/css'

type DropdownProps = {
  askClose?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parentRef?: MutableRefObject<any>
} & HTMLAttributes<HTMLUListElement>

const Dropdown = (props: PropsWithChildren<DropdownProps>) => {
  const { children, className, askClose, parentRef, ...rest } = props

  if (!open) {
    return null
  }

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      parentRef &&
      parentRef.current &&
      !parentRef.current.contains(event.target as unknown as Node)
    ) {
      askClose?.()
    }
  }

  useEventListener('mousedown', handleOutsideClick)

  return (
    <ul
      className={cx(
        css({
          pos: 'absolute',
          minW: '175px',
          right: '0%',
          top: '55px',
          padding: '5px',
          bg: 'news.backgrounds.tertiary',
          border: 'news.grey',
          zIndex: 9999,
          animation: 'fadeIn .2s',
        }),
        className
      )}
      {...rest}
    >
      {children}
    </ul>
  )
}

const DropdownItem = (
  props: PropsWithChildren<HTMLAttributes<HTMLLIElement>>
) => {
  const { children, className, ...rest } = props
  return (
    <li
      className={cx(
        css({
          color: 'news.fonts.label',
          p: '10px',
          cursor: 'pointer',
          transition: '.3s',
          textAlign: 'center',

          _hover: {
            bg: 'white',
            color: 'black',
          },

          '&:not(:first-child)': {
            mt: '5px',
          },
        }),
        className
      )}
      {...rest}
    >
      {children}
    </li>
  )
}

Dropdown.Item = DropdownItem

export { Dropdown }
