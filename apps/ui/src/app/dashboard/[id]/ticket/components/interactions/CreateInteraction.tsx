import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ButtonStylePicker } from '~/app/dashboard/components/discord/ButtonStylePicker'
import { DiscordEmojiPicker } from '~/app/dashboard/components/discord/DiscordEmojiPicker'
import { EmojiPicker } from '~/app/dashboard/components/EmojiPicker'
import { DashboardCard } from '~/layouts/Dashboard'
import { ButtonSpecial } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { Typography } from '~/ui/typography/Typography'
import {
  CreateOrUpdateInteractionPayload,
  useInteractionMutations,
} from './hooks/useInteractionMutations'

export const CreateInteraction = () => {
  const { register, setValue, getValues, watch, handleSubmit } = useForm({
    defaultValues: {
      name: null,
      style: 1,
      emoji: null,
    },
  })

  const { createInteraction } = useInteractionMutations()

  const [emojis, setEmojis] = useState(false)
  const watchedEmoji = watch('emoji')

  const handleCreateInteraction = (data: CreateOrUpdateInteractionPayload) => {
    // TODO: validate data.
    // console.log(window.location)
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
      <Typography color="secondary" typography="span">
        Create interaction
      </Typography>
      <Input {...register('name')} label="Le label du bouton" />
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
      <ButtonSpecial onClick={handleSubmit(handleCreateInteraction)}>
        Crée
      </ButtonSpecial>
    </DashboardCard>
  )
}
