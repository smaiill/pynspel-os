import { PropsWithChildren } from 'react'
import { DashboardPage, DashboardView } from '~/layouts/Dashboard'
import Aside from '../components/Aside'

export const ModuleLayout = ({ children }: PropsWithChildren) => {
  return (
    <DashboardPage>
      <Aside />
      <DashboardView>{children}</DashboardView>
    </DashboardPage>
  )
}
