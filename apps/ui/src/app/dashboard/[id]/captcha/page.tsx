'use client'
import { Modules } from '@pynspel/common'
import { FlexColumn } from '~/layouts/Flex'
import { LoadingModule } from '../../components/LoadingModule'
import { useFetchModule } from '../../hooks/modules'
import { useFetchGuild } from '../../hooks/useFetchGuild'
import { ModuleLayout } from '../../layouts/ModuleLayout'
import { CaptchaForm } from './components/CaptchaForm'

type Props = {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { data: guildData, isLoading: isGuildLoading } = useFetchGuild(id)
  const { data: moduleData, isLoading: isModuleLoading } = useFetchModule(
    Modules.captcha,
    id
  )

  if (isGuildLoading || isModuleLoading) {
    return <LoadingModule />
  }

  if (!guildData) {
    return <h1>Loading guild...</h1>
  }

  if (!moduleData) {
    return <h1>Loading module data...</h1>
  }

  return (
    <ModuleLayout params={params}>
      <FlexColumn style={{ gap: 10 }}>
        <CaptchaForm data={moduleData} />
      </FlexColumn>
    </ModuleLayout>
  )
}

export default page
