import { zodResolver } from '@hookform/resolvers/zod'
import { SCHEMA_UPDATE_INTERACTION } from '@pynspel/common'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineDelete } from 'react-icons/ai'
import { BsEmojiWink } from 'react-icons/bs'
import { ButtonStylePicker } from '~/app/dashboard/components/discord/ButtonStylePicker'
import { EmojiPicker } from '~/app/dashboard/components/EmojiPicker'
import { DashboardCard } from '~/layouts/Dashboard'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { useCurrentGuildCategorys } from '~/proxys/dashboard'
import { ButtonDanger, ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { Typography } from '~/ui/typography/Typography'
import {
  css,
  cva,
  RecipeVariantProps,
} from '../../../../../../../styled-system/css'
import { CreateInteraction } from './CreateInteraction'
import {
  UpdateInteractionPayload,
  useInteractionMutations,
} from './hooks/useInteractionMutations'

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
  const { t } = useTranslation()

  return (
    <FlexColumn style={{ gap: 10 }}>
      <Typography as="span">
        {t('modules.ticket.panel.interactions.title')}
      </Typography>
      <CreateInteraction />
      {interactions?.map((interaction) => (
        <Interaction key={interaction.id} interaction={interaction} />
      ))}
    </FlexColumn>
  )
}

const emojiPickerStyle = css({
  bg: '#2B2929',
  width: '75px',
  height: '75px',
  rounded: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const Interaction = (props: any) => {
  const { interaction } = props

  console.log(interaction)

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      emoji: interaction.emoji,
      name: interaction.name,
      style: interaction.style,
      parent_id: interaction.parent_id,
    },
    resolver: zodResolver(SCHEMA_UPDATE_INTERACTION),
  })
  const [emojis, setEmojis] = useState(false)
  const [parentId, setParentId] = useState(getValues('parent_id'))
  const watchedEmoji = watch('emoji')
  const watchedName = watch('name')
  const watchedStyle = watch('style')
  const { t } = useTranslation()

  const handleStyleChange = ({ style }: { style: number }) => {
    setValue('style', style, {
      shouldDirty: true,
    })
  }

  const handleEmojiClick = (e) => {
    setValue('emoji', e.emoji, {
      shouldDirty: true,
    })
  }

  const formatedCategorys = useCurrentGuildCategorys().map((channel) => {
    return { label: channel.name, value: channel.id }
  })

  const { deleteInteraction, updateInteraction } = useInteractionMutations()

  useEffect(() => {
    setValue('parent_id', parentId, {
      shouldDirty: true,
    })
  }, [parentId])

  const handleUpdateInteraction = (data: UpdateInteractionPayload) => {
    updateInteraction
      .mutateAsync({ id: interaction.id, payload: data })
      .then(() => {
        reset({}, { keepValues: true })
      })
  }

  return (
    <DashboardCard>
      <FlexColumn style={{ gap: 10 }}>
        <Flex style={{ gap: 5, justifyContent: 'space-between' }}>
          <DiscordButton
            button={{
              style: watchedStyle,
              name: watchedName,
              emoji: watchedEmoji,
            }}
          />
          <ButtonDanger
            onClick={() => deleteInteraction.mutate(interaction.id)}
            style={{ borderRadius: '10px', fontSize: '15px' }}
          >
            <AiOutlineDelete />
          </ButtonDanger>
        </Flex>
        <FlexColumn style={{ gap: 10, alignItems: 'flex-start' }}>
          <Input
            {...register('name')}
            label={t('modules.ticket.panel.interactions.button_label')}
          />
          <InputSelect
            value={parentId}
            setValue={setParentId}
            options={formatedCategorys}
          >
            {t('modules.ticket.panel.interactions.category')}
          </InputSelect>
          <ButtonStylePicker
            default={getValues('style')}
            onChange={handleStyleChange}
          />
          <div
            onClick={() => setEmojis((prevV) => !prevV)}
            className={emojiPickerStyle}
          >
            <span style={{ fontSize: '25px' }}>
              {watchedEmoji ?? <BsEmojiWink />}
            </span>
          </div>

          {emojis ? <EmojiPicker onEmojiClick={handleEmojiClick} /> : null}
          {isDirty ? (
            <ButtonPrimary onClick={handleSubmit(handleUpdateInteraction)}>
              {t('actions.save')}
            </ButtonPrimary>
          ) : null}
        </FlexColumn>
      </FlexColumn>
    </DashboardCard>
  )
}

export { PanelInteractions }
