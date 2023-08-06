'use client'
import { Modules } from '@pynspel/common'
import { FlexColumn } from '~/layouts/Flex'
import { useFetchModule } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import { ModuleLayout } from '../../layouts/ModuleLayout'
import TicketForm from './components/TicketForm'
import { TicketPanels } from './components/TicketPanels'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { data: guildData } = useFetchGuild(id)
  const { data: moduleData } = useFetchModule(Modules.ticket, id)

  if (!guildData) {
    return <h1>Loading guild...</h1>
  }

  if (!moduleData) {
    return <h1>Loading module data...</h1>
  }

  return (
    <ModuleLayout>
      <FlexColumn style={{ gap: 10 }}>
        {!guildData ? 'Loading...' : <TicketForm data={moduleData} />}
        <TicketPanels />
      </FlexColumn>
    </ModuleLayout>
  )
}

export default page
