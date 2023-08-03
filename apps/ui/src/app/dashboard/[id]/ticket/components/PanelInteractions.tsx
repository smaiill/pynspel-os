import React, { useState } from 'react'
import { Flex, FlexColumn } from '~/layouts/Flex'
import Picker from 'emoji-picker-react'
import { EmojiPicker } from '~/app/dashboard/components/EmojiPicker'
import { AiOutlineDelete } from 'react-icons/ai'
import {
  RecipeVariantProps,
  css,
  cva,
} from '../../../../../../styled-system/css'
import { Input } from '~/ui/input/Input'
import { useForm } from 'react-hook-form'
import { DashboardCard } from '~/layouts/Dashboard'
import { ButtonStylePicker } from '~/app/dashboard/components/discord/ButtonStylePicker'

type Props = {
  interactions: any[]
}

interface DiscordButtonProps {
  button: {
    style: number
    emoji?: string
    name?: string
  }
}

const discordButtonRecipe = cva({
  base: {
    color: 'white',
    borderRadius: '10px',
    display: 'flex',
    gap: '10px',
    minWidth: '100px',
    height: '50px',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 15px',
  },
  variants: {
    style: {
      primary: {
        bgColor: '#5865F2',
      },
      secondary: {
        bgColor: '#4F545C',
      },
      success: {
        bgColor: '#43B581',
      },
      danger: {
        bgColor: '#F04747',
      },
    },
  },
  defaultVariants: {
    style: 'primary',
  },
})

type DiscordButtonVariants = RecipeVariantProps<typeof discordButtonRecipe>

const DiscordButtonStyles = {
  1: 'primary',
  2: 'secondary',
  3: 'success',
  4: 'danger',
} as const

export const DiscordButton = ({
  button,
}: DiscordButtonProps & DiscordButtonVariants) => {
  return (
    <button
      className={discordButtonRecipe({
        style: DiscordButtonStyles[button.style],
      })}
    >
      {button.emoji ? <span className="emoji">{button.emoji}</span> : null}
      {button.name ? <span className="name">{button.name}</span> : null}
    </button>
  )
}

const PanelInteractions = (props: Props) => {
  const { interactions } = props

  return (
    <FlexColumn style={{ gap: 10 }}>
      {interactions.map((interaction) => (
        <Interaction key={interaction.id} interaction={interaction} />
      ))}
    </FlexColumn>
  )
}

const Interaction = (props: any) => {
  const { interaction } = props

  const { register, setValue, getValues } = useForm({
    defaultValues: {
      emoji: interaction.emoji,
      name: interaction.name,
      style: interaction.style,
    },
  })

  const handleStyleChange = ({ style }: { style: number }) => {
    setValue('style', style)
  }
  console.log('Style', getValues('style'))

  const handleEmojiClick = (e) => {
    console.log(e)
  }

  return (
    <DashboardCard>
      <FlexColumn style={{ gap: 10 }}>
        <Flex>
          <DiscordButton button={interaction} />
          <AiOutlineDelete />
        </Flex>
        <FlexColumn>
          <Input {...register('name')} label="Contenu du bouton" />
          <ButtonStylePicker
            default={getValues('style')}
            onChange={handleStyleChange}
          />
          <div className="emojiPicker">
            <span style={{ fontSize: '25px' }}>{getValues('emoji')}</span>
          </div>
          {/* <EmojiPicker onClick={handleEmojiClick} /> */}
        </FlexColumn>
      </FlexColumn>
    </DashboardCard>
  )
}

export { PanelInteractions }
