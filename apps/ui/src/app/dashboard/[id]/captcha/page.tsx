'use client'
import { Modules } from '@pynspel/common'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import Aside from '../../components/Aside'
import { SkeletonBox, SkeletonTitle } from '../../components/Skeletons'
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
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn style={{ gap: 10 }}>
          <CaptchaForm data={moduleData} />
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}

export default page
