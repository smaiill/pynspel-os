import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { ButtonPrimary } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../../styled-system/css'

const styles = css({
  alignItems: 'center',
  gap: '10px',
  backgroundColor: '#191919',
  padding: '20px',
  borderRadius: '10px',
  flex: '1 0 300px',

  '& img': {
    borderRadius: '10px',
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
        src={'/pubg.png'}
        // src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}.png`}
      />
      <Typography as="h4">{props.name}</Typography>
      <ButtonPrimary onClick={handleManageGuild}>
        {t('pages.dashboard.manage_server')}
      </ButtonPrimary>
    </FlexColumn>
  )
}

export { ServerCard }
