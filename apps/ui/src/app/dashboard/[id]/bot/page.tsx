'use client'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useGuildService } from '~/hooks/useGuildService'
import {
  DashboardCard,
  DashboardPage,
  DashboardView,
} from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import { selectedGuild, useSelectedGuildSnapshot } from '~/proxys/dashboard'
import { botModuleProxy, useBotModuleSnapshpt } from '~/proxys/modules'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { InputSelect } from '~/ui/input/InputSelect'
import { Typography } from '~/ui/typography/Typography'
import Aside from '../../components/Aside'
import { useBotModuleService } from './hooks/useBotModuleService'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { guild } = useSelectedGuildSnapshot()
  const { getGuild } = useGuildService()
  const { getGuildConfig, updateConfiguration } = useBotModuleService()
  const { register, handleSubmit } = useForm<{ name: string }>()
  const { id } = params
  const botSnapshot = useBotModuleSnapshpt()
  const [presence, setPresence] = useState('online')

  useEffect(() => {
    const fetchGuild = async () => {
      const res = await getGuild({ guildId: id })

      selectedGuild.guild = res
    }

    !guild && fetchGuild()
  }, [])

  const { data } = useQuery({
    queryKey: ['module_bot', guild?.guild_id],
    enabled: !!guild && botSnapshot.configuration === null,
    queryFn: () => getGuildConfig(guild?.guild_id as string),
    onSuccess(data) {
      botModuleProxy.configuration = data.bot_module
      setPresence(data.bot_module.status)
    },
  })

  if (!guild) {
    return <h1>Loading guild...</h1>
  }

  if (!data) {
    return <h1>No data...</h1>
  }

  const handleOnSubmit = () => {
    handleSubmit((data) =>
      updateConfiguration({
        newConfig: { ...data, status: presence },
        guildId: id,
      }).then((res) => (botModuleProxy.configuration = res.bot_module))
    )
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn
          style={{
            gap: 10,
          }}
        >
          <Typography typography="h2">Bot {guild?.name}</Typography>
          <Typography color="secondary" typography="span">
            Rends ton bot vraiment spécial en changeant son nom d'utilisateur,
            son avatar et son activité.
          </Typography>

          <DashboardCard>
            <FlexColumn
              style={{
                gap: 10,
              }}
            >
              <InputSelect
                options={[
                  { label: 'Online', value: 'online' },
                  { label: 'Do not disturbe', value: 'dnd' },
                  { label: 'AFK', value: 'idle' },
                ]}
                value={presence}
                setValue={setPresence}
              >
                Status du bot
              </InputSelect>
              <Input
                defaultValue={botSnapshot.configuration?.name}
                {...register('name')}
                label="Nom du bot !"
              />

              <ButtonPrimary onClick={handleOnSubmit} type="submit">
                Mettre a jour !
              </ButtonPrimary>
            </FlexColumn>
          </DashboardCard>
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}

export default page
