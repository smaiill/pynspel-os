import { Flex, FlexColumn } from '~/layouts/Flex'
import { ButtonSpecial } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../styled-system/css'

const featureStyle = css({
  gap: '20px',
  justifyContent: 'space-between',

  _even: {
    flexDir: 'row-reverse',
  },

  '& span': {
    w: '400px',
    fontSize: '15px',
  },

  '& h1': {
    fontSize: '50px',
    w: '450px',
  },
})

export const Feature = () => {
  return (
    <Flex className={featureStyle}>
      <FlexColumn className={css({ justifyContent: 'space-between' })}>
        <FlexColumn className={css({ gap: '10px' })}>
          <Typography as="h1">Etre sure que les mecs qui joins</Typography>
          <Typography color="secondary" as="span">
            Illustrez votre créativité dans les intégrations en utilisant la
            personnalisation simple de ProBot et en l'envoyant à n'importe quel
            salon préféré.
          </Typography>
        </FlexColumn>
        <Flex>
          <ButtonSpecial>Learn more</ButtonSpecial>
        </Flex>
      </FlexColumn>
      <img src="/pages/home/captcha.png" alt="captcha" />
    </Flex>
  )
}
