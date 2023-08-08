'use client'
import { Modules } from '@pynspel/common'
import { FlexColumn } from '~/layouts/Flex'
import { useFetchModule } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import { ModuleLayout } from '../../layouts/ModuleLayout'
import TicketForm from './components/TicketForm'
import { TicketPanels } from './components/TicketPanels'
import {
  SkeletonBox,
  SkeletonCustom,
  SkeletonTitle,
} from '../../components/Skeletons'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { data: guildData, isLoading: isGuildLoading } = useFetchGuild(id)
  const { data: moduleData, isLoading: isModuleLoading } = useFetchModule(
    Modules.ticket,
    id
  )

  if (isGuildLoading || isModuleLoading) {
    return (
      <ModuleLayout>
        <SkeletonBox />
        <SkeletonCustom hSize={6} />
        <SkeletonTitle />
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
        <TicketForm data={moduleData} />
        <TicketPanels />
      </FlexColumn>
    </ModuleLayout>
  )
}

export default page
