import { useRef, useState } from 'react'
import { FlexColumn } from '~/layouts/Flex'
import { useTranslation } from '~/locales/Provider'
import { Typography } from '~/ui/typography/Typography'
import { css } from '../../../styled-system/css'
import { Dropdown } from '../dropdown/Dropdown'
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
  const parentRef = useRef<HTMLDivElement>(null)

  const onChange = (newValue: string) => {
    update(newValue)
    setCurrentValue(newValue)
    setIsOpen(false)
  }

  const currentLocale = getLocaleByValue(currentValue)

  return (
    <FlexColumn
      ref={parentRef}
      onClick={() => setIsOpen((prevV) => !prevV)}
      className={css({
        pos: 'relative',
        cursor: 'pointer',
        userSelect: 'none',
      })}
    >
      {currentLocale?.flag}
      {open ? (
        <Dropdown
          parentRef={parentRef}
          askClose={() => setIsOpen(false)}
          className={css({ top: '41px !important' })}
        >
          {locales.map((locale) => (
            <Dropdown.Item
              onClick={(e) => {
                e.stopPropagation()
                onChange(locale.value)
              }}
              key={locale.value}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              })}
            >
              {locale.flag}
              <Typography
                className={css({ fontSize: '14px' })}
                as="span"
                color="secondary"
              >
                {locale.label}
              </Typography>
            </Dropdown.Item>
          ))}
        </Dropdown>
      ) : null}
    </FlexColumn>
  )
}
