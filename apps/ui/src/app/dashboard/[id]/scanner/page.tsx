'use client'
import { Modules } from '@pynspel/common'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import Aside from '../../components/Aside'
import { useFetchModule } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import ScannerForm from './components/ScannerForm'
import { ModuleLayout } from '../../layouts/ModuleLayout'
import { SkeletonCustom } from '../../components/Skeletons'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { data: guildData, isLoading: isGuildLoading } = useFetchGuild(id)
  const { data: moduleData, isLoading: isModuleLoading } = useFetchModule(
    Modules.scanner,
    id
  )

  if (isGuildLoading || isModuleLoading) {
    return (
      <ModuleLayout>
        <FlexColumn style={{ gap: 10 }}>
          <SkeletonCustom hSize={10} />
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
        <ScannerForm data={moduleData} />
      </FlexColumn>
    </ModuleLayout>
  )
}

export default page
