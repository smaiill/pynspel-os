'use client'
import { BotModuleConfig } from '@pynspel/types'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useGuildService } from '~/hooks/useGuildService'
import {
  DashboardCard,
  DashboardPage,
  DashboardView,
} from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import { selectedGuild, useSelectedGuildSnapshot } from '~/proxys/dashboard'
import { ButtonPrimary } from '~/ui/button/Button'
import { Input } from '~/ui/input/Input'
import { Typography } from '~/ui/typography/Typography'
import Aside from '../../components/Aside'
import { useBotModuleService } from './hooks/useBotModuleService'

type Props = {
  params: {
    id: bigint
  }
}

const page = ({ params }: Props) => {
  const { guild } = useSelectedGuildSnapshot()
  const { getGuild } = useGuildService()
  const { getGuildConfig, updateConfiguration } = useBotModuleService()
  const { register, handleSubmit } = useForm()
  const { id } = params

  useEffect(() => {
    const fetchGuild = async () => {
      const res = await getGuild({ guildId: id })

      selectedGuild.guild = res
    }

    !guild && fetchGuild()
  }, [])

  const { data } = useQuery({
    queryKey: ['module_bot', guild?.guild_id],
    enabled: !!guild,
    queryFn: () => getGuildConfig(guild?.guild_id as bigint),
  })

  if (!guild) {
    return <h1>Loading guild...</h1>
  }

  if (!data) {
    return <h1>No data...</h1>
  }

  console.log(data)
  const { bot_module } = data

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn
          style={{
            gap: 10,
          }}
        >
          <Typography variant="h2">Bot {guild.name}</Typography>
          <Typography type="secondary" variant="span">
            Rends ton bot vraiment spécial en changeant son nom d'utilisateur,
            son avatar et son activité.
          </Typography>

          <DashboardCard>
            <FlexColumn
              style={{
                gap: 10,
              }}
            >
              <Input
                defaultValue={bot_module.name}
                {...register('name')}
                label="Nom du bot !"
              />
              <ButtonPrimary
                onClick={handleSubmit((data) =>
                  updateConfiguration({
                    newConfig: data as BotModuleConfig,
                    guildId: id,
                  })
                )}
                type="submit"
              >
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
