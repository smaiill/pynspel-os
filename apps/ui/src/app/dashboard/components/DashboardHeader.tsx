import UserConnectedHeader from '~/components/UserConnectedHeader'
import { Flex } from '~/layouts/Flex'
import { ButtonPremium } from '~/ui/button/Button'
import { css } from '../../../../styled-system/css'

const styles = css({
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 20px',
  backgroundColor: '#191919',
  borderBottom: '1px solid #333131',
  minHeight: '80px',
  gap: 10,
})

const DashboardHeader = () => {
  return (
    <Flex className={styles}>
      <ButtonPremium>Premium</ButtonPremium>
      <UserConnectedHeader />
    </Flex>
  )
}

export default DashboardHeader
