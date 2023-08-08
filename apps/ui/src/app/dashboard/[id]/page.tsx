'use client'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { Typography } from '~/ui/typography/Typography'
import Aside from '../components/Aside'
import { SelectedServerInformation } from '../components/SelectedServerInformation'
import { useFetchGuild } from '../hooks/useFetchGuild'
import { useEffect } from 'react'
import { useCurrentGuildState, useSetCurrentGuild } from '~/proxys/dashboard'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import {
  SkeletonBox,
  SkeletonEdge,
  SkeletonTitle,
} from '../components/Skeletons'

export interface Props {
  params: {
    id: string
  }
}

const page = ({ params }: Props) => {
  const { id } = params
  const { data: guildData, isLoading } = useFetchGuild(id)
  const [currentGuild, setCurrentGuild] = useCurrentGuildState()

  useEffect(() => {
    setCurrentGuild(guildData)
  }, [guildData])

  if (isLoading) {
    return 'Loading....'
  }

  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <Typography as="h1">
          Welcome, smail. 👋 on {currentGuild?.name}
        </Typography>

        <SelectedServerInformation />
      </DashboardView>
    </DashboardPage>
  )
}

export default page
