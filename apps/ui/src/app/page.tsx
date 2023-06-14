'use client'
import { MainHeader } from '~/components/header/main/MainHeader'
import { Flex } from '~/layouts/Flex'
import style from '~/scss/pages/main.module.scss'
import { ButtonPrimary, ButtonSpecial } from '~/ui/button/Button'
import { Typography } from '~/ui/typography/Typography'

const page = () => {
  return (
    <>
      <MainHeader />

      <main className={style.main}>
        <Typography
          style={{
            fontSize: 'clamp(2rem, 8vw, 4rem)',
          }}
          className="__days"
          variant="h1"
        >
          Pynspel <br /> Discord Bot
        </Typography>
        <Typography
          style={{
            marginTop: 10,
          }}
          type="secondary"
          variant="p"
        >
          Pynspel is a versatile Discord bot designed to assist users in
          securing and protecting their servers.
        </Typography>
        <Flex
          style={{
            gap: 10,
            marginTop: 30,
          }}
        >
          <ButtonPrimary>Ajouter Pynspel</ButtonPrimary>
          <ButtonSpecial>Dashboard</ButtonSpecial>
        </Flex>
        <Typography type="secondary" variant="p" className={style.servers}>
          Serving 100,191 server.
        </Typography>
      </main>
    </>
  )
}

export default page
