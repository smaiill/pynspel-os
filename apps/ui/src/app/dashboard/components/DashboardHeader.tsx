import { Flex } from '~/layouts/Flex'
import { css } from '../../../../styled-system/css'

const styles = css({
  height: '80px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 20px',
  backgroundColor: '#191919',
  borderBottom: '1px solid #333131',
})

const DashboardHeader = () => {
  return <Flex className={styles}></Flex>
}

export default DashboardHeader
