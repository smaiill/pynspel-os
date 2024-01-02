import { zodResolver } from '@hookform/resolvers/zod'
import { SCHEMA_UPDATE_INTERACTION } from '@pynspel/common'
import { EmojiClickData } from 'emoji-picker-react'
import { MouseEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineDelete } from 'react-icons/ai'
import { ButtonStylePicker } from '~/app/dashboard/components/discord/ButtonStylePicker'
import { DiscordEmojiPicker } from '~/app/dashboard/components/discord/DiscordEmojiPicker'
import { EmojiPicker } from '~/app/dashboard/components/EmojiPicker'
import { FieldError } from '~/app/dashboard/components/form/FieldError'
import { Modal } from '~/app/dashboard/components/modals/Modal'
import { DashboardCard } from '~/layouts/Dashboard'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { useCurrentGuildCategorys } from '~/proxys/dashboard'
import { ButtonDanger, ButtonOutline, ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { Label } from '~/ui/Label'
import {
  css,
  cva,
  RecipeVariantProps,
} from '../../../../../../../styled-system/css'
import { CreateInteraction } from './CreateInteraction'
import {
  CreateOrUpdateInteractionPayload,
  useInteractionMutations,
} from './hooks/useInteractionMutations'

type Props = {
  interactions: any[]
}

interface DiscordButtonProps {
  button: {
    style: 1 | 2 | 3 | 4
    emoji?: string
    name?: string
  }
  live?: boolean
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
      <CreateInteraction />
      {interactions?.map((interaction) => (
        <Interaction key={interaction.id} interaction={interaction} />
      ))}
    </FlexColumn>
  )
}

const Interaction = (props: any) => {
  const { interaction } = props

  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    defaultValues: {
      emoji: interaction.emoji,
      name: interaction.name,
      style: interaction.style,
      parent_id: interaction.parent_id,
    },
    resolver: zodResolver(SCHEMA_UPDATE_INTERACTION),
  })
  const [open, setIsOpen] = useState(false)
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

  const handleEmojiClick = (e: EmojiClickData) => {
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

  const handleUpdateInteraction = (data: CreateOrUpdateInteractionPayload) => {
    updateInteraction
      .mutateAsync({ id: interaction.id, payload: data })
      .then(() => {
        reset({}, { keepValues: true })
      })
  }

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    setIsOpen(false)
  }

  const handleAction = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    deleteInteraction.mutate(interaction.id)
    setIsOpen(false)
  }

  return (
    <DashboardCard>
      <FlexColumn style={{ gap: 10 }}>
        <Flex
          style={{
            gap: 5,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <DiscordButton
            button={{
              style: watchedStyle,
              name: watchedName,
              emoji: watchedEmoji,
            }}
            live
          />
          <ButtonDanger
            onClick={() => setIsOpen(true)}
            style={{ fontSize: '15px' }}
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
          <FlexColumn className={css({ gap: '5px' })}>
            <Label>Button color</Label>
            <ButtonStylePicker
              default={getValues('style')}
              onChange={handleStyleChange}
            />
          </FlexColumn>

          <FlexColumn className={css({ gap: '5px' })}>
            <Label>Button emoji</Label>

            <DiscordEmojiPicker onClick={() => setEmojis((prevV) => !prevV)}>
              {watchedEmoji}
            </DiscordEmojiPicker>
          </FlexColumn>

          {emojis ? <EmojiPicker onEmojiClick={handleEmojiClick} /> : null}
          {(errors as { atLeastOne?: string })?.atLeastOne ? (
            <FieldError>{t('errors.E_V_NAME_OR_EMOJI')}</FieldError>
          ) : null}
          {isDirty ? (
            <ButtonPrimary onClick={handleSubmit(handleUpdateInteraction)}>
              {t('actions.save')}
            </ButtonPrimary>
          ) : null}
        </FlexColumn>
      </FlexColumn>
      {open ? (
        <Modal>
          <Modal.Header
            title={t('modules.ticket.sure_to_delete')}
            description={t('modules.ticket.sure_to_delete')}
          />
          <Modal.Footer>
            <ButtonOutline onClick={handleCancel}>
              {t('actions.cancel')}
            </ButtonOutline>
            <ButtonDanger onClick={handleAction}>
              {t('actions.delete')}
            </ButtonDanger>
          </Modal.Footer>
        </Modal>
      ) : null}
    </DashboardCard>
  )
}

export { PanelInteractions }
