import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import { FlexColumn } from '~/layouts/Flex'
import Aside from './Aside'
import { SkeletonBox, SkeletonTitle } from './Skeletons'

export const LoadingModule = () => {
  return (
    <DashboardPage>
      <Aside />
      <DashboardView>
        <FlexColumn style={{ gap: 10 }}>
          <SkeletonBox />
          <SkeletonTitle />
          <SkeletonBox />
          <SkeletonTitle />
          <SkeletonBox />
          <SkeletonTitle />
        </FlexColumn>
      </DashboardView>
    </DashboardPage>
  )
}
