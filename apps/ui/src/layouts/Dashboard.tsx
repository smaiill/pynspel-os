import { ChevronDown } from 'lucide-react'
import {
  HTMLAttributes,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import DashboardHeader from '~/app/dashboard/components/DashboardHeader'
import { Typography } from '~/ui/typography/Typography'
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

type DashboardCardProps = {
  openable?: boolean
  title?: string
} & HTMLAttributes<HTMLDivElement>

const DashboardCard = (props: PropsWithChildren<DashboardCardProps>) => {
  const { children, style, openable = false, title, ...rest } = props
  const [isOpen, setIsOpen] = useState(false)
  const [openHeight, setOpenHeight] = useState('55px')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      setOpenHeight(`${cardRef.current.scrollHeight}px`)
    }
  }, [cardRef])

  return (
    <div
      style={{
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#191919',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        // overflow: 'hidden',
        transition: 'max-height 1s',
        width: '100%',
        ...(openable ? { maxHeight: isOpen ? openHeight : '55px' } : {}),
      }}
      ref={cardRef}
      onClick={() => setIsOpen((prevV) => !prevV)}
      {...rest}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...(!title && openable ? { justifyContent: 'flex-end' } : {}),
        }}
      >
        {title ? (
          <Typography color="secondary" as="h5">
            {title}
          </Typography>
        ) : null}
        {openable ? <ChevronDown /> : null}
      </header>
      <div
        style={
          !title && openable && !isOpen ? { marginTop: '5px', ...style } : style
        }
      >
        {children}
      </div>
    </div>
  )
}

export { DashboardView, DashboardPage, DashboardCard }
