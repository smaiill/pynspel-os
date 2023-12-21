import { zodResolver } from '@hookform/resolvers/zod'
import { SCHEMA_CREATE_INTERACTION } from '@pynspel/common'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ButtonStylePicker } from '~/app/dashboard/components/discord/ButtonStylePicker'
import { DiscordEmojiPicker } from '~/app/dashboard/components/discord/DiscordEmojiPicker'
import { EmojiPicker } from '~/app/dashboard/components/EmojiPicker'
import { FieldError } from '~/app/dashboard/components/form/FieldError'
import { DashboardCard } from '~/layouts/Dashboard'
import { useTranslation } from '~/locales/Provider'
import { useCurrentGuildCategorys } from '~/proxys/dashboard'
import { ButtonSpecial } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { Typography } from '~/ui/typography/Typography'
import {
  CreateOrUpdateInteractionPayload,
  useInteractionMutations,
} from './hooks/useInteractionMutations'

export const CreateInteraction = () => {
  const {
    register,
    setValue,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: null,
      style: 1,
      emoji: null,
      parent_id: null,
    },
    resolver: zodResolver(SCHEMA_CREATE_INTERACTION),
  })
  const { t } = useTranslation()
  const [parentId, setParentId] = useState(getValues('parent_id'))

  const { createInteraction } = useInteractionMutations()

  const formatedCategorys = useCurrentGuildCategorys().map((channel) => {
    return { label: channel.name, value: channel.id }
  })

  const [emojis, setEmojis] = useState(false)
  const watchedEmoji = watch('emoji')

  useEffect(() => {
    setValue('parent_id', parentId)
  }, [parentId])
  const handleCreateInteraction = (data: CreateOrUpdateInteractionPayload) => {
    createInteraction.mutate(data)
  }

  return (
    <DashboardCard
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <Typography color="secondary" as="span">
        {t('modules.ticket.panel.interactions.title')}
      </Typography>
      <Input
        {...register('name')}
        label={t('modules.ticket.panel.interactions.button_label')}
        error={errors.name?.message}
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
        onChange={({ style }) => setValue('style', style)}
      />
      <DiscordEmojiPicker onClick={() => setEmojis((prevV) => !prevV)}>
        {watchedEmoji}
      </DiscordEmojiPicker>
      {emojis ? (
        <EmojiPicker onEmojiClick={(e) => setValue('emoji', e.emoji)} />
      ) : null}
      {errors?.atLeastOne ? (
        <FieldError>{t('errors.E_V_NAME_OR_EMOJI')}</FieldError>
      ) : null}
      <ButtonSpecial
        disabled={createInteraction.isLoading}
        onClick={handleSubmit(handleCreateInteraction)}
      >
        {t('actions.add')}
      </ButtonSpecial>
    </DashboardCard>
  )
}
