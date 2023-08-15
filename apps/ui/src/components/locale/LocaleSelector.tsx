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
      className={css({ pos: 'relative', cursor: 'pointer' })}
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
            bg: '#2b2929',
            top: '30px',
            padding: '10px',
            left: '50%',
            width: '175px',
            zIndex: 9999,
            rounded: '5px',
            gap: '10px',
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
                padding: '5px',
                cursor: 'pointer',
                rounded: '5px',
                _hover: {
                  bg: '#323030',
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
