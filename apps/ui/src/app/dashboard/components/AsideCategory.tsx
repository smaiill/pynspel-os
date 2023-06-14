import { PropsWithChildren } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'
import style from './aside.category.module.scss'

const AsideCategory = (props: PropsWithChildren) => {
  const { children } = props
  return (
    <FlexColumn className={style.category}>
      <Flex
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className={style.header}
      >
        <Typography
          style={{
            fontWeight: 600,
          }}
          type="secondary"
          variant="p"
        >
          Gestion du serveur
        </Typography>
        <BiChevronDown />
      </Flex>
      <FlexColumn className={style.wrapper}>{children}</FlexColumn>
    </FlexColumn>
  )
}

export { AsideCategory }
