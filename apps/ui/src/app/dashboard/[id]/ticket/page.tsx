'use client'
import { Modules } from '@pynspel/common'
import { FlexColumn } from '~/layouts/Flex'
import { Tabs } from '~/ui/tabs/Tabs'
import { LoadingModule } from '../../components/LoadingModule'
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
  const { data: guildData, isLoading: isGuildLoading } = useFetchGuild(id)
  const { data: moduleData, isLoading: isModuleLoading } = useFetchModule(
    Modules.ticket,
    id
  )

  if (isGuildLoading || isModuleLoading || !guildData || !moduleData) {
    return <LoadingModule />
  }

  return (
    <ModuleLayout>
      <FlexColumn style={{ gap: 10 }}>
        <Tabs>
          <Tabs.Tab label="Settings">
            <TicketForm data={moduleData} />
          </Tabs.Tab>
          <Tabs.Tab label="Panels">
            <TicketPanels />
          </Tabs.Tab>
        </Tabs>
      </FlexColumn>
    </ModuleLayout>
  )
}

export default page
