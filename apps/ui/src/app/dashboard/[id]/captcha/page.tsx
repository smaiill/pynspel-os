'use client'
import { Modules } from '@pynspel/common'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import Aside from '../../components/Aside'
import { useFetchModule } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import { CaptchaForm } from './components/CaptchaForm'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { data: guildData } = useFetchGuild(id)
  const { data: moduleData } = useFetchModule(Modules.captcha, id)

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
          {!guildData ? 'Loading...' : <CaptchaForm data={moduleData} />}
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}

export default page
