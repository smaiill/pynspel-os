import { HTMLAttributes, PropsWithChildren, useRef } from 'react'
import DashboardHeader from '~/app/dashboard/components/DashboardHeader'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../styled-system/css'
import { Flex, FlexColumn } from './Flex'

const DashboardView = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <FlexColumn
      className={css({
        flex: 1,
        overflowY: 'auto',
        bg: 'news.backgrounds.primary',
      })}
    >
      <DashboardHeader />
      <FlexColumn className={css({ flexDir: 'column', p: 10, flex: 1 })}>
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

type DashboardCardProps = {
  title?: string
} & HTMLAttributes<HTMLDivElement>

const DashboardCard = (props: PropsWithChildren<DashboardCardProps>) => {
  const { children, style, title, ...rest } = props
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className={css({
        padding: 15,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        // overflow: 'hidden',
        transition: 'max-height 1s',
        bg: 'news.backgrounds.secondary',
        width: '100%',
        border: 'news.grey',
      })}
      ref={cardRef}
      {...rest}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {title ? (
          <Typography color="secondary" as="h5">
            {title}
          </Typography>
        ) : null}
      </header>
      <div style={!title ? { marginTop: '5px', ...style } : style}>
        {children}
      </div>
    </div>
  )
}

export { DashboardView, DashboardPage, DashboardCard }
