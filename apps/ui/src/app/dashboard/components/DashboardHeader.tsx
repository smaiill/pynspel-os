import { Flex } from '~/layouts/Flex'
import { css } from '../../../../styled-system/css'
import { useUserSnapshot } from '~/proxys/user'
import UserConnectedHeader from '~/components/UserConnectedHeader'
import { ButtonPremium, ButtonWarn } from '~/ui/button/Button'

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
