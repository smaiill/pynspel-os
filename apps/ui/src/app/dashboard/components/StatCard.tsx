import { BiUser } from 'react-icons/bi'
import { Flex, FlexColumn } from '~/layouts/Flex'
import style from './stat.card.module.scss'

const StatCard = () => {
  return (
    <Flex className={style.card}>
      <FlexColumn>
        <p>Users</p>
        <span>10</span>
      </FlexColumn>
      <Flex>
        <BiUser />
      </Flex>
    </Flex>
  )
}

export { StatCard }
