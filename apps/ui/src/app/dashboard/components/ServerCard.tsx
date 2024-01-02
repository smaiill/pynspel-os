import { DiscordGuild } from '@pynspel/types'
import { useRouter } from 'next/navigation'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { ButtonPrimary } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'
import { getGuildIcon, getRandomDefaultAvatar } from '~/utils/discord'
import { css } from '../../../../styled-system/css'

const styles = css({
  backgroundColor: 'news.backgrounds.secondary',
  flex: '1 0 300px',
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

const ServerCard = (props: DiscordGuild) => {
  const router = useRouter()
  const { t } = useTranslation()

  const handleManageGuild = () => {
    router.push(`/dashboard/${props.id}`)
  }

  const serverIcon = props.icon
    ? getGuildIcon(props.id, props.icon)
    : getRandomDefaultAvatar()

  return (
    <FlexColumn className={styles}>
      <img
        className={css({
          pos: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(5px)',
          opacity: '.05',
        })}
        src={serverIcon}
      />
      <img
        className={css({ zIndex: '100', mt: '25px' })}
        alt="server-image"
        width={75}
        height={75}
        src={serverIcon}
      />
      <Flex className={css({ zIndex: '100', p: '40px 25px 25px 25px' })}>
        <Typography as="h4">{props.name}</Typography>
        <ButtonPrimary onClick={handleManageGuild}>
          {t('pages.dashboard.manage_server')}
        </ButtonPrimary>
      </Flex>
    </FlexColumn>
  )
}

export { ServerCard }
