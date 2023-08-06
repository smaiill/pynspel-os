'use client'
import { Modules } from '@pynspel/common'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import Aside from '../../components/Aside'
import { useFetchModule } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import ScannerForm from './components/ScannerForm'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { data: guildData } = useFetchGuild(id)
  const { data: moduleData } = useFetchModule(Modules.scanner, id)

  if (!guildData) {
    return <h1>Loading guild...</h1>
  }

  if (!moduleData) {
    return <h1>Loading module data...</h1>
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn style={{ gap: 10 }}>
          {!guildData ? 'Loading...' : <ScannerForm data={moduleData} />}
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}

export default page
