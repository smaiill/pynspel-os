'use client'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useGuildService } from '~/hooks/useGuildService'
import { Flex } from '~/layouts/Flex'
import { HeaderAndFooterLayout } from '~/layouts/HeaderAndFooterLayout'
import { useTranslation } from '~/locales/Provider'
import { ButtonPrimary, ButtonSpecial } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'
import { css, cx } from '../../styled-system/css'

const serversStyles = css({
  marginTop: '20px',
  position: 'relative',
  zIndex: 2,

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
  textAlign: 'center',
})

const page = () => {
  const { getServingGuilds } = useGuildService()
  const router = useRouter()

  const { data } = useQuery<{
    count: number
  }>({
    queryKey: ['serving-guilds'],
    queryFn: getServingGuilds,
  })

  const { t } = useTranslation()

  return (
    <HeaderAndFooterLayout>
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
        <Flex className={css({ gap: 10, mt: 30, zIndex: 2 })}>
          <ButtonPrimary
            onClick={() => {
              window.open(
                `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&permissions=1376805514262&scope=bot`,
                '_blank'
              )
            }}
          >
            {t('pages.home.add_pynspel')}
          </ButtonPrimary>
          <ButtonSpecial onClick={() => router.push('/dashboard')}>
            {t('pages.home.go_to_dashboard')}
          </ButtonSpecial>
        </Flex>
        <Typography color="secondary" as="p" className={serversStyles}>
          {t('pages.home.serving_servers', {
            amount: data?.count ?? 0,
          })}
        </Typography>
      </main>

      {/* <Features /> */}
      {/* <ShowcaseDiscords /> */}
    </HeaderAndFooterLayout>
  )
}

export default page
