import { Plus } from 'lucide-react'
import { HTMLAttributes, PropsWithChildren } from 'react'
import { css, cx } from '../../styled-system/css'

export const AddPlaceholder = ({
  children,
  className,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => {
  return (
    <div
      className={cx(
        css({
          bg: '_tertiary.300',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px',
          border: 'news.tertiaryDashed',
          transition: '.1s',
          cursor: 'pointer',

          _active: {
            scale: '.99',
          },
          _hover: {
            bg: '_tertiary.900',
          },
        }),
        className
      )}
      {...rest}
    >
      {children ? children : <Plus />}
    </div>
  )
}
