import { Pen, TicketIcon } from 'lucide-react'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../styled-system/css'
import { FeatureLayout } from './FeatureLayout'

const TicketPanel = ({ name }: { name: string }) => {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: 'blur(0px)',
        p: '15px 20px',
        border: '1px solid rgba(255, 255, 255, .1)',
        bg: 'rgba(0, 0, 0, .1)',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDir: 'column',
          gap: '10px',
        })}
      >
        <Typography
          className={css({
            color: 'white',
            fontFamily: 'Days one !important',
          })}
          as="h5"
        >
          {name}
        </Typography>
        <div
          className={css({
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          })}
        >
          <TicketIcon color="green" size={18} />
          <TicketIcon color="orange" size={18} />
          <TicketIcon color="red" size={18} />
        </div>
      </div>
      <Pen className={css({ color: 'white' })} size={15} />
    </div>
  )
}

export const Ticket = () => {
  return (
    <FeatureLayout
      title="Tickets"
      className={css({
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDir: 'column',
      })}
    >
      <TicketPanel name="Help" />
      <TicketPanel name="Market" />
      <TicketPanel name="RP" />
    </FeatureLayout>
  )
}
