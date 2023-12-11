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
  padding: '40px 25px 25px 25px',
  gap: '20px',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'news.grey',
  pos: 'relative',
  overflow: 'hidden',

  '& div': {
    w: '100%',
    justifyContent: 'space-between',

    '& img': {
      rounded: '50%',
    },
  },
})

const ServerCard = (props: any) => {
  const router = useRouter()
  const { t } = useTranslation()

  const handleManageGuild = () => {
    router.push(`/dashboard/${props.id}`)
  }

  const serverIcon = props.icon
    ? `https://cdn.discordapp.com/icons/${props.id}/${props.icon}.png`
    : '/icons/discord.svg'

  return (
    <FlexColumn className={styles}>
      <img
        className={css({
          pos: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(0px)',
          opacity: '.1',
        })}
        src={serverIcon}
      />
      <Image
        className={css({ zIndex: '100' })}
        alt="server-image"
        width={75}
        height={75}
        src={serverIcon}
      />
      <Flex className={css({ zIndex: '100' })}>
        <Typography as="h4">{props.name}</Typography>
        <ButtonPrimary onClick={handleManageGuild}>
          {t('pages.dashboard.manage_server')}
        </ButtonPrimary>
      </Flex>
    </FlexColumn>
  )
}

export { ServerCard }
