import { Flex, FlexColumn } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../styled-system/css'

export const ShowCaseDiscord = () => {
  return (
    <Flex
      className={css({
        p: '20px',
        minW: '300px',
        gap: '15px',
        rounded: '15px',
        bg: 'news.backgrounds.primary',
      })}
    >
      <img
        className={css({ w: '75px', h: '75px', rounded: '10px' })}
        src="/pubg.png"
      />
      <FlexColumn>
        <Typography as="h4">Watha</Typography>
        <Typography as="span">170,000 Members</Typography>
      </FlexColumn>
    </Flex>
  )
}
