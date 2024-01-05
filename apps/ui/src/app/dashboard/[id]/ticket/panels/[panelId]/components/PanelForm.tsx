import { zodResolver } from '@hookform/resolvers/zod'
import { SCHEMA_UPDATE_PANEL } from '@pynspel/common'
import { PanelApi } from '@pynspel/types'
import { ChannelType } from 'discord-api-types/v10'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DashboardCard } from '~/layouts/Dashboard'
import { useTranslation } from '~/locales/Provider'
import { useCurrentGuildChannels } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { css } from '../../../../../../../../styled-system/css'
import { usePanelMutations } from '../../hooks/usePanelMutations'

type Props = {
  data: Omit<PanelApi, 'interactions'>
}

export const PanelForm = (props: Props) => {
  const { data } = props

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: data.name,
      message: data.message,
      channel_id: data.channel_id,
    },
    resolver: zodResolver(SCHEMA_UPDATE_PANEL),
  })

  const { t } = useTranslation()

  const [selectedChannel, setSelectedChannel] = useState(
    getValues('channel_id')
  )

  const formatedChannels = useCurrentGuildChannels(ChannelType.GuildText).map(
    (channel) => {
      return { label: channel.name, value: channel.id }
    }
  )

  const { updatePanel } = usePanelMutations()

  const handleUpdatePanel = (
    parsedData: z.infer<typeof SCHEMA_UPDATE_PANEL>
  ) => {
    updatePanel.mutate({
      data: {
        ...parsedData,
        channel_id: selectedChannel,
      },
      panelId: data.id,
    })
  }

  return (
    <DashboardCard
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        alignItems: 'flex-start',
      }}
    >
      <Input
        {...register('name')}
        label={t('modules.ticket.create_panel_name')}
        error={errors.name?.message}
        required
      />
      <Input
        {...register('message')}
        label={t('modules.ticket.panel.message')}
        error={errors.message?.message}
      />
      <InputSelect
        options={formatedChannels}
        value={selectedChannel}
        setValue={setSelectedChannel}
        required
      >
        {t('modules.ticket.panel.channel')}
      </InputSelect>

      <ButtonPrimary
        onClick={handleSubmit(handleUpdatePanel)}
        disabled={updatePanel.isLoading}
        type="submit"
        className={css({ mt: '5px' })}
      >
        {t('actions.save')}
      </ButtonPrimary>
    </DashboardCard>
  )
}
