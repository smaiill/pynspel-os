'use client'
import { Modules } from '@pynspel/common'
import { useProtectedRoute } from '~/hooks/useProtectedRoute'
import { FlexColumn } from '~/layouts/Flex'
import { LoadingModule } from '../../components/LoadingModule'
import { useFetchModule } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import { ModuleLayout } from '../../layouts/ModuleLayout'
import ScannerForm from './components/ScannerForm'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  useProtectedRoute()

  const { data: guildData, isLoading: isGuildLoading } = useFetchGuild(id)
  const { data: moduleData, isLoading: isModuleLoading } = useFetchModule(
    Modules.scanner,
    id
  )

  if (isGuildLoading || isModuleLoading || !guildData || !moduleData) {
    return <LoadingModule />
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
