import { HTMLAttributes, PropsWithChildren } from 'react'
import DashboardHeader from '~/app/dashboard/components/DashboardHeader'
import { Flex, FlexColumn } from './Flex'

const DashboardView = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <FlexColumn
      style={{
        flex: 1,
        overflowY: 'auto',
        backgroundColor: '#1F1F1F',
      }}
    >
      <DashboardHeader />
      <FlexColumn
        style={{
          flexDirection: 'column',
          padding: 20,
          flex: 1,
        }}
      >
        {children}
      </FlexColumn>
    </FlexColumn>
  )
}

type DashboardPageProps = HTMLAttributes<HTMLDivElement>

const DashboardPage = (props: PropsWithChildren<DashboardPageProps>) => {
  const { children, ...rest } = props
  return (
    <Flex
      style={{
        height: '100vh',
        maxHeight: '100vh',
      }}
      {...rest}
    >
      {children}
    </Flex>
  )
}

type DashboardCardProps = HTMLAttributes<HTMLDivElement>

const DashboardCard = (props: PropsWithChildren<DashboardCardProps>) => {
  const { children } = props
  return (
    <div
      style={{
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#191919',
        color: 'white',
      }}
    >
      {children}
    </div>
  )
}

export { DashboardView, DashboardPage, DashboardCard }
