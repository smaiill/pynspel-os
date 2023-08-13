'use client'
import { Modules } from '@pynspel/common'
import { useRouter } from 'next/navigation'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import Aside from '../../components/Aside'
import { useFetchModule, useGlobalModules } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import BotForm from './components/BotForm'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { push } = useRouter()
  const { data: globalModules, isLoading: isModulesLoading } =
    useGlobalModules()
  const { data: guildData, isLoading: isGuildLoading } = useFetchGuild(id)
  const { data: moduleData, isLoading: isModuleLoading } = useFetchModule(
    Modules.bot,
    id
  )

  if (isModulesLoading || isGuildLoading || isModuleLoading) {
    return <h1>Loading...</h1>
  }

  if (!guildData || !globalModules || !moduleData) {
    return push('/dashboard')
  }

  const isActive = globalModules.find((module) => module.name === 'bot')?.active

  if (!isActive) {
    return push(`/dashboard/${guildData.guild_id}`)
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn style={{ gap: 10 }}>
          <BotForm data={moduleData} />
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}

export default page
