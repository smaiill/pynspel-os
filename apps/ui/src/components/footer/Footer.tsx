import { MoveUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { BsDiscord } from 'react-icons/bs'
import { Flex } from '~/layouts/Flex'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../styled-system/css'
import { Logo } from '../branding/Logo'
import { CustomLink } from '../Link'
import { SocialLink } from '../SocialLink'

const SocialLinks = [
  {
    icon: <BsDiscord />,
    href: 'https://discord.com',
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
        {[1, 1, 1, 1].map((value, idx) => (
          <FooterSection
            key={idx}
            title="Product"
            items={[
              { href: '#', label: 'Gallery' },
              { href: '#', label: 'School' },
              { href: '#', label: 'Contact' },
              { href: '#', label: 'Home' },
            ]}
          />
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

const ExploreOurProduct = () => {
  const [width, setWidth] = useState(0)
  const intervalRef = useRef(0)
  const onMouseDown = () => {
    const intervalId = setInterval(() => {
      setWidth((prevV) => (prevV + 1 >= 100 ? 0 : prevV + 1))
    }, 100)

    intervalRef.current = intervalId
  }

  const onMouseUp = () => {
    clearInterval(intervalRef.current)
    setWidth(0)
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
        rounded: '10px',
        border: 'news.grey',
        pos: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',

        _before: {
          content: '""',
          height: '30px',
          width: '2px',
          bg: 'news.backgrounds.secondary',
          pos: 'absolute',
          top: '0',
          right: '7%',
        },

        _after: {
          content: '""',
          height: '30px',
          width: '2px',
          bg: 'news.backgrounds.secondary',
          pos: 'absolute',
          bottom: '0',
          right: '7%',
        },
      })}
    >
      <div
        className={css({
          pos: 'absolute',
          height: '100%',
          bg: 'news.backgrounds.primary',
          left: 0,
          top: 0,
          zIndex: '1',
        })}
        style={{ width: `${width}%` }}
      />
      <Typography className={css({ zIndex: 99 })} as="h5">
        Explore Pynspel
      </Typography>
      <MoveUpRight className={css({ zIndex: 99 })} color="white" />
    </div>
  )
}

export { Footer }
