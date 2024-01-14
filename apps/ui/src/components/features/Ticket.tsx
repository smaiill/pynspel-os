import { Pen, TicketIcon } from 'lucide-react'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../styled-system/css'
import { FeatureLayout } from './FeatureLayout'

const TicketPanel = () => {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      })}
    >
      <div className={css({ display: 'flex', flexDir: 'column', gap: '10px' })}>
        <Typography className={css({ color: 'white' })} as="h5">
          Panel #1
        </Typography>
        <div
          className={css({
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          })}
        >
          <TicketIcon color="green" size={20} />
          <TicketIcon color="orange" size={20} />
          <TicketIcon color="red" size={20} />
        </div>
      </div>
      <Pen className={css({ color: 'white' })} size={15} />
    </div>
  )
}

export const Ticket = () => {
  return (
    <FeatureLayout
      className={css({
        display: 'flex',
        justifyContent: 'space-evenly',
        flexDir: 'column',
      })}
    >
      <TicketPanel />
      <TicketPanel />
      <TicketPanel />
    </FeatureLayout>
  )
}
