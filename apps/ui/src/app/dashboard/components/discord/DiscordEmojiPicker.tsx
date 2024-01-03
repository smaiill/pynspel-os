import { Smile } from 'lucide-react'
import { HTMLAttributes, PropsWithChildren } from 'react'
import { css } from '../../../../../styled-system/css'
const emojiPickerStyle = css({
  bg: 'news.backgrounds.tertiary',
  width: '75px',
  height: '75px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
})

export const DiscordEmojiPicker = (
  props: PropsWithChildren<HTMLAttributes<HTMLElement>>
) => {
  const { children, ...rest } = props
  return (
    <div className={emojiPickerStyle} {...rest}>
      <span style={{ fontSize: '25px' }}>
        {children ?? <Smile className={css({ color: 'whiteAlpha.300' })} />}
      </span>
    </div>
  )
}
