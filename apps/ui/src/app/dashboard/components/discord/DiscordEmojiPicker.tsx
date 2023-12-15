import { HTMLAttributes, PropsWithChildren } from 'react'
import { BsEmojiWink } from 'react-icons/bs'
import { css } from '../../../../../styled-system/css'
const emojiPickerStyle = css({
  bg: 'news.backgrounds.tertiary',
  width: '75px',
  height: '75px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const DiscordEmojiPicker = (
  props: PropsWithChildren<HTMLAttributes<HTMLElement>>
) => {
  const { children } = props
  return (
    <div className={emojiPickerStyle} {...props}>
      <span style={{ fontSize: '25px' }}>{children ?? <BsEmojiWink />}</span>
    </div>
  )
}
