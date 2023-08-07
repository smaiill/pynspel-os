'use client'
import { Modules } from '@pynspel/common'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import Aside from '../../components/Aside'
import { useFetchModule } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import LoggingForm from './components/LoggingForm'
import { ModuleLayout } from '../../layouts/ModuleLayout'
import { SkeletonBox, SkeletonTitle } from '../../components/Skeletons'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { data: guildData, isLoading: isGuildLoading } = useFetchGuild(id)
  const { data: moduleData, isLoading: isModuleLoading } = useFetchModule(
    Modules.logging,
    id
  )

  if (isGuildLoading || isModuleLoading) {
    return (
      <ModuleLayout>
        <FlexColumn style={{ gap: 10 }}>
          <SkeletonBox />
          <SkeletonTitle />
          <SkeletonBox />
          <SkeletonTitle />
        </FlexColumn>
      </ModuleLayout>
    )
  }

  if (!guildData) {
    return <h1>Loading guild...</h1>
  }

  if (!moduleData) {
    return <h1>Loading module data...</h1>
  }

  return (
    <ModuleLayout>
      <FlexColumn style={{ gap: 10 }}>
        <LoggingForm data={moduleData} />
      </FlexColumn>
    </ModuleLayout>
  )
}

export default page
