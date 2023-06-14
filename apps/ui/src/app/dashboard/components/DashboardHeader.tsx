import { Flex } from '~/layouts/Flex'
import { ButtonWarn } from '~/ui/button/Button'
import style from './dashboard.header.module.scss'

const DashboardHeader = () => {
  return (
    <Flex className={style.header}>
      <ButtonWarn>Premium</ButtonWarn>
    </Flex>
  )
}

export default DashboardHeader
