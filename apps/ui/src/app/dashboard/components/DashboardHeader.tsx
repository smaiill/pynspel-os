import { LocaleSelector } from '~/components/locale/LocaleSelector'
import UserConnectedHeader from '~/components/UserConnectedHeader'
import { Flex } from '~/layouts/Flex'
import { css } from '../../../../styled-system/css'

const styles = css({
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 20px',
  backgroundColor: 'news.backgrounds.secondary',
  borderBottom: 'news.grey',
  minHeight: '80px',
  gap: 10,
})

const DashboardHeader = () => {
  return (
    <Flex className={styles}>
      <LocaleSelector />
      <UserConnectedHeader />
    </Flex>
  )
}

export default DashboardHeader
