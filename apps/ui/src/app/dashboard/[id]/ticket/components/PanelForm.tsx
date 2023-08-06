import { PanelApi } from '@pynspel/types'
import { useForm } from 'react-hook-form'
import { FlexColumn } from '~/layouts/Flex'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { useCurrentGuildValue } from '~/proxys/dashboard'
import { useState } from 'react'
import { usePanelMutations } from '../panels/hooks/usePanelMutations'

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

  console.log({ currentGuild })

  if (!currentGuild) {
    return <h1>Loading guild....</h1>
  }

  const formatedChannels = currentGuild.channels.map((channel) => {
    return { label: channel.name, value: channel.id }
  })

  const { updatePanel } = usePanelMutations()
  console.log({ formatedChannels })

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

  return (
    <FlexColumn style={{ gap: 5 }}>
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
