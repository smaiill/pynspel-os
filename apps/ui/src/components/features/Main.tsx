import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../styled-system/css'
import { Captcha } from './Captcha'
import { Logs } from './Logs'
import { Scanner } from './Scanner'
import { Ticket } from './Ticket'

export const Features = () => {
  return (
    <section
      className={css({
        pos: 'relative',
        overflow: 'hidden',
        borderTop: 'news.grey',
        borderBottom: 'news.grey',
      })}
    >
      <img
        src="/pages/home/real.png"
        className={css({
          pos: 'absolute',
          minW: '100%',
          minH: '100%',
          opacity: '.5',
        })}
      />
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          flexDir: 'column',
          p: '80px 10px',
        })}
      >
        <Typography as="h1">Features</Typography>
        <Typography
          className={css({ maxW: '800px', textAlign: 'center', mt: '5px' })}
          as="span"
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente,
          dolorem laborum corporis asperiores incidunt non beatae suscipit sed
          unde magnam nihil omnis at dolores ducimus illum tenetur quisquam
          inventore voluptate?
        </Typography>

        <div
          className={css({
            zIndex: '100',
            display: 'flex',
            mt: '60px',
            gap: '10px',
            flexWrap: 'wrap',
            w: '100%',
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexDir: 'row',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'center',
              w: '100%',
              justifyContent: 'center',
            })}
          >
            <Captcha />
            <Logs />
          </div>
          <div
            className={css({
              display: 'flex',
              flexDir: 'row',
              gap: '10px',
              flexWrap: 'wrap',
              alignItems: 'center',
              w: '100%',
              justifyContent: 'center',
            })}
          >
            <Scanner />
            <Ticket />
          </div>
        </div>
      </div>
    </section>
  )
}
