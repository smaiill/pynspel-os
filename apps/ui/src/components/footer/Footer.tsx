import { DISCORD_INVITATION_LINK } from '@pynspel/info'
import { MoveUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { Flex } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../styled-system/css'
import { CustomLink } from '../Link'
import { SocialLink } from '../SocialLink'
import { Logo } from '../branding/Logo'

const SocialLinks = [
  {
    icon: ({ w, h }: { w: number; h: number }) => {
      return (
        <svg
          width={w}
          height={h}
          viewBox="0 -28.5 256 256"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          preserveAspectRatio="xMidYMid"
        >
          <g>
            <path
              d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
              fill="currentColor"
              fillRule="nonzero"
            ></path>
          </g>
        </svg>
      )
    },
    href: DISCORD_INVITATION_LINK,
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
        href: '/legal/privacy',
      },
      {
        label: 'CGV',
        href: '/legal/cgv',
      },
      {
        label: 'CGU',
        href: '/legal/cgu',
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

        <Flex>
          {SocialLinks.map((socialLink, idx) => {
            return (
              <SocialLink href={socialLink.href} key={idx}>
                {<socialLink.icon w={20} h={20} />}
              </SocialLink>
            )
          })}
        </Flex>
      </Flex>

      {/* <ExploreOurProduct /> */}
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ExploreOurProduct = () => {
  const [width, setWidth] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const downIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onMouseDown = () => {
    if (downIntervalRef.current) {
      clearInterval(downIntervalRef.current)
    }
    const intervalId = setInterval(() => {
      setWidth((prevV) => (prevV + W_TO_ADD >= 100 ? 100 : prevV + W_TO_ADD))
    }, TIME)

    intervalRef.current = intervalId
  }

  const onMouseUp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
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
      style={{ scale: width * 0.0001 + 1 }}
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
