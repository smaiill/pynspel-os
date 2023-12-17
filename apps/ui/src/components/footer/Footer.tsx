import { MoveUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { BsDiscord } from 'react-icons/bs'
import { DISCORD_LINK } from '~/constants'
import { Flex } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../styled-system/css'
import { Logo } from '../branding/Logo'
import { CustomLink } from '../Link'
import { SocialLink } from '../SocialLink'

const SocialLinks = [
  {
    icon: <BsDiscord />,
    href: DISCORD_LINK,
  },
]

const footerItems: {
  title: string
  items: { href: string; label: string }[]
}[] = [
  {
    title: 'Pynspel',
    items: [
      {
        label: 'Home',
        href: '/',
      },
      {
        label: 'Dashboard',
        href: '/dashboard',
      },
    ],
  },
  {
    title: 'Legals',
    items: [
      {
        label: 'Privacy',
        href: '/privacy',
      },
      {
        label: 'Terms',
        href: '/terms',
      },
    ],
  },
  {
    title: 'Autres',
    items: [
      {
        label: 'top.gg',
        href: '/',
      },
    ],
  },
]

const Footer = () => {
  return (
    <footer
      className={css({
        minH: '400px',
        bg: 'news.backgrounds.secondary',
        p: '6%',
        display: 'flex',
        flexDir: 'column',
        gap: '75px',
        justifyContent: 'space-between',
        borderTop: 'news.grey',
      })}
    >
      <Flex
        className={css({
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          rowGap: '20px',
        })}
      >
        {footerItems.map((value, idx) => (
          <FooterSection key={idx} title={value.title} items={value.items} />
        ))}
      </Flex>

      <Flex
        className={css({
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          borderTop: 'news.grey',
          pt: '30px',
          rowGap: '20px',
        })}
      >
        <Logo />

        <Flex
          className={css({
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap',
          })}
        >
          <CustomLink href="/">Terms</CustomLink>
          <CustomLink href="/">Privacy</CustomLink>
        </Flex>

        <Flex>
          {SocialLinks.map((socialLink, idx) => {
            return (
              <SocialLink href={socialLink.href} key={idx}>
                {socialLink.icon}
              </SocialLink>
            )
          })}
        </Flex>
      </Flex>

      <ExploreOurProduct />
    </footer>
  )
}

const FooterSection = ({
  title,
  items,
}: {
  title: string
  items: { href: string; label: string }[]
}) => {
  return (
    <div className={css({ minW: '100px' })}>
      <Typography
        className={css({
          textTransform: 'uppercase',
          fontWeight: 600,
          pos: 'relative',
          fontSize: 'sm !important',
          ml: '15px',
          _before: {
            content: '""',
            pos: 'absolute',
            width: '7px',
            height: '7px',
            translate: '0 -50%',
            bg: 'news.fonts.label',
            top: '50%',
            left: '-15px',
            rounded: '50%',
          },
        })}
        color="news.label"
        as="span"
      >
        {title}
      </Typography>
      <ul
        className={css({
          mt: '10px',
          display: 'flex',
          gap: '5px',
          flexDir: 'column',
        })}
      >
        {items.map((item, idx) => (
          <CustomLink
            className={css({
              color: 'news.fonts.primary',
              fontSize: '15px',
              fontWeight: 400,
            })}
            href={item.href}
            key={idx}
          >
            {item.label}
          </CustomLink>
        ))}
      </ul>
    </div>
  )
}

const TIME = 0
const W_TO_ADD = 0.2

const ExploreOurProduct = () => {
  const [width, setWidth] = useState(0)
  const [isPressing, setIsPressing] = useState(false)
  const intervalRef = useRef(0)
  const downIntervalRef = useRef(0)
  const onMouseDown = () => {
    clearInterval(downIntervalRef.current)
    setIsPressing(true)
    const intervalId = setInterval(() => {
      setWidth((prevV) => (prevV + W_TO_ADD >= 100 ? 100 : prevV + W_TO_ADD))
    }, TIME)

    intervalRef.current = intervalId
  }

  const onMouseUp = () => {
    clearInterval(intervalRef.current)
    setIsPressing(false)
    const intervalId = setInterval(() => {
      setWidth((prevV) => (prevV - W_TO_ADD <= 0 ? 0 : prevV - W_TO_ADD))
    }, TIME)
    downIntervalRef.current = intervalId
  }
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      className={css({
        bg: 'rgba(34, 34, 34, .5)',
        p: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: 'news.grey',
        pos: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        userSelect: 'none',
        _before: {
          content: '""',
          height: '30px',
          width: '2px',
          bg: 'news.backgrounds.secondary',
          pos: 'absolute',
          top: '0',
          right: '110px',
          zIndex: 99,
        },

        _after: {
          content: '""',
          height: '30px',
          width: '2px',
          bg: 'news.backgrounds.secondary',
          pos: 'absolute',
          bottom: '0',
          right: '110px',
          zIndex: 99,
        },
      })}
      style={!isPressing ? {} : { animation: 'animateThis 0.1s infinite' }}
    >
      <div
        className={css({
          pos: 'absolute',
          height: '100%',
          bg: '#CFD0C8',
          left: 0,
          top: 0,
          zIndex: '1',
        })}
        style={{
          width: `${width}%`,
        }}
      />
      <Typography
        className={css({ zIndex: 99, mixBlendMode: 'difference' })}
        as="h5"
      >
        Explore Pynspel
      </Typography>
      <MoveUpRight
        className={css({ zIndex: 99, mixBlendMode: 'difference' })}
        color="white"
      />
    </div>
  )
}

export { Footer }
