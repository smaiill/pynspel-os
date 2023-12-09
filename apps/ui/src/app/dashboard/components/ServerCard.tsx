import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { ButtonPrimary } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../styled-system/css'

const styles = css({
  backgroundColor: 'news.backgrounds.secondary',
  flex: '1 0 300px',
  rounded: '10px',
  padding: '40px 25px 25px 25px',
  gap: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'news.grey',

  '& img': {
    rounded: '50%',
  },

  '& div': {
    w: '100%',
    justifyContent: 'space-between',
  },
})

const ServerCard = (props: any) => {
  const router = useRouter()
  const { t } = useTranslation()

  const handleManageGuild = () => {
    router.push(`/dashboard/${props.id}`)
  }

  return (
    <FlexColumn className={styles}>
      <Image
        alt="server-image"
        width={75}
        height={75}
        src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}.png`}
      />
      <Flex>
        <Typography as="h4">{props.name}</Typography>
        <ButtonPrimary onClick={handleManageGuild}>
          {t('pages.dashboard.manage_server')}
        </ButtonPrimary>
      </Flex>
    </FlexColumn>
  )
}

export { ServerCard }
