import { useState } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../styled-system/css'
import { BritishFlag, FrenchFlag } from './Flags'

const locales = [
  {
    value: 'fr',
    flag: <FrenchFlag size={25} />,
    label: 'Francais',
  },
  {
    value: 'en',
    flag: <BritishFlag size={25} />,
    label: 'English',
  },
] as const

const getLocaleByValue = (value: string) => {
  return locales.find((locale) => locale.value === value)
}

export const LocaleSelector = () => {
  const { update, locale } = useTranslation()
  const [currentValue, setCurrentValue] = useState(locale)
  const [open, setIsOpen] = useState(false)

  const onChange = (newValue: string) => {
    update(newValue)
    setCurrentValue(newValue)
    setIsOpen(false)
  }

  const currentLocale = getLocaleByValue(currentValue)

  return (
    <FlexColumn
      onClick={() => setIsOpen((prevV) => !prevV)}
      className={css({
        pos: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
      })}
    >
      <Flex className={css({ gap: '15px', alignItems: 'center' })}>
        <Flex className={css({ gap: '5px', alignItems: 'center' })}>
          {currentLocale?.flag}
          <Typography
            className={css({ fontSize: '14px' })}
            as="span"
            color="secondary"
          >
            {currentLocale?.value?.toUpperCase()}
          </Typography>
        </Flex>

        <BsChevronDown
          strokeWidth={1.5}
          className={css({
            cursor: 'pointer',
            transition: '.3s',
          })}
          style={
            open
              ? { transform: 'rotate(180deg)', color: 'grey' }
              : { color: 'grey' }
          }
        />
      </Flex>

      {open ? (
        <FlexColumn
          className={css({
            translate: '-50%',
            pos: 'absolute',
            bg: 'news.backgrounds.tertiary',
            top: '30px',
            padding: '5px',
            left: '50%',
            width: '175px',
            zIndex: 9999,
            gap: '5px',
            border: 'news.grey',
          })}
        >
          {locales.map((locale) => (
            <Flex
              onClick={(e) => {
                e.stopPropagation()
                onChange(locale.value)
              }}
              className={css({
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                cursor: 'pointer',
                _hover: {
                  bg: 'news.backgrounds.secondary',
                },
              })}
              key={locale.value}
            >
              {locale.flag}
              <Typography
                className={css({ fontSize: '14px' })}
                as="span"
                color="secondary"
              >
                {locale.label}
              </Typography>
            </Flex>
          ))}
        </FlexColumn>
      ) : null}
    </FlexColumn>
  )
}
