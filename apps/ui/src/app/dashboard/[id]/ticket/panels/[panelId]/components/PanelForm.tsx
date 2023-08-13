import { PanelApi } from '@pynspel/types'
import { ChannelType } from 'discord-api-types/v10'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FlexColumn } from '~/layouts/Flex'
import {
  useCurrentGuildChannels,
  useCurrentGuildValue,
} from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { usePanelMutations } from '../../hooks/usePanelMutations'

type Props = {
  data: Omit<PanelApi, 'interactions'>
}

export const PanelForm = (props: Props) => {
  const { data } = props

  if (!data) {
    return 'No data...'
  }

  const currentGuild = useCurrentGuildValue()

  const { register, handleSubmit, getValues } = useForm({
    defaultValues: {
      name: data.name,
      message: data.message,
      channel_id: data.channel_id,
    },
  })

  const [selectedChannel, setSelectedChannel] = useState(
    getValues('channel_id')
  )

  const formatedChannels = useCurrentGuildChannels(ChannelType.GuildText).map(
    (channel) => {
      return { label: channel.name, value: channel.id }
    }
  )

  const { updatePanel } = usePanelMutations()

  const handleUpdatePanel = (parsedData: any) => {
    // TODO: Validate the data

    updatePanel.mutate({
      data: {
        ...parsedData,
        channel_id: selectedChannel,
      },
      panelId: data.id,
    })
  }

  if (!currentGuild) {
    return <h1>Loading guild....</h1>
  }

  return (
    <FlexColumn style={{ gap: 5, alignItems: 'flex-start' }}>
      <Input {...register('name')} label="Nom du panel" />
      <Input {...register('message')} label="Message" />
      <InputSelect
        options={formatedChannels}
        value={selectedChannel}
        setValue={setSelectedChannel}
      />

      <ButtonPrimary
        onClick={handleSubmit(handleUpdatePanel)}
        disabled={updatePanel.isLoading}
        type="submit"
      >
        Enregistrer
      </ButtonPrimary>
    </FlexColumn>
  )
}
