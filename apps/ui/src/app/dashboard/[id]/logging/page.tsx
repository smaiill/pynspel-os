'use client'
import { Modules } from '@pynspel/common'
import { FlexColumn } from '~/layouts/Flex'
import { LoadingModule } from '../../components/LoadingModule'
import { useFetchModule } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import { ModuleLayout } from '../../layouts/ModuleLayout'
import LoggingForm from './components/LoggingForm'

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

  if (isGuildLoading || isModuleLoading || !guildData || !moduleData) {
    return <LoadingModule />
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
