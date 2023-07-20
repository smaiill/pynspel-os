import { BiUser } from 'react-icons/bi'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { css } from '../../../../styled-system/css'

const styles = css({
  height: '200px',
  flex: 1,
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 50px',
  justifyContent: 'space-between',
  color: 'white',
})

const StatCard = () => {
  return (
    <Flex className={styles}>
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
