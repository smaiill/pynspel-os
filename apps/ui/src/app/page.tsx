'use client'
import { useQuery } from '@tanstack/react-query'
import { MainHeader } from '~/components/header/main/MainHeader'
import { useGuildService } from '~/hooks/useGuildService'
import { Flex } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { ButtonPrimary, ButtonSpecial } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'
import { css, cx } from '../../styled-system/css'

const serversStyles = css({
  marginTop: '20px',
  position: 'relative',

  _before: {
    content: '""',
    backgroundColor: 'green',
    position: 'absolute',
    height: '5px',
    width: '5px',
    borderRadius: '50%',
    animation: `pulse 1s infinite linear`,
    left: '-20px',
    transform: 'translate(0, -50%)',
    top: '50%',
  },
})

const main = css({
  minHeight: 'calc(100vh - 100px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  backgroundSize: '22px 22px',

  '& h1': {
    textAlign: 'center',
  },
})

const page = () => {
  const { getServingGuilds } = useGuildService()

  const { data, refetch } = useQuery<{
    count: number
  }>({
    queryKey: ['serving-guilds'],
    queryFn: getServingGuilds,
  })

  const { t } = useTranslation()

  return (
    <>
      <MainHeader />

      <main className={cx(main, '__decoration')}>
        <Typography
          style={{
            fontSize: 'clamp(2rem, 8vw, 4rem)',
          }}
          className="__days"
          as="h1"
        >
          Pynspel <br /> Discord Bot
        </Typography>
        <Typography
          style={{
            marginTop: 10,
          }}
          color="secondary"
          as="p"
        >
          {t('pages.home.description')}
        </Typography>
        <Flex
          style={{
            gap: 10,
            marginTop: 30,
          }}
        >
          <ButtonPrimary>{t('pages.home.add_pynspel')}</ButtonPrimary>
          <ButtonSpecial>{t('pages.home.go_to_dashboard')}</ButtonSpecial>
        </Flex>
        <Typography color="secondary" as="p" className={serversStyles}>
          {t('pages.home.serving_servers', {
            amount: data?.count ?? 0,
          })}
        </Typography>
      </main>
    </>
  )
}

export default page
