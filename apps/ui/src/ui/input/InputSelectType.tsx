import { KeyboardEvent, PropsWithChildren } from 'react'
import { BsPlus } from 'react-icons/bs'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { Input } from '~/ui/input/Input'
import { css } from '../../../styled-system/css'

type InputSelectTypeProps = {
  words: string[]
  onChange(words: string[]): void
  empty?: string
  placeholder?: string
}

const wordStyle = css({
  bg: 'white',
  padding: '1px 4px',
  alignItems: 'center',
  gap: '5px',

  '& span ': {
    color: 'black',
  },

  '& button': {
    color: 'black',
    transition: '0.4s',
    cursor: 'pointer',

    _hover: {
      color: 'red',
    },

    '& svg': {
      rotate: '45deg',
      fontSize: '20px',
      marginTop: '1px',
    },
  },
})

const InputSelectType = (props: PropsWithChildren<InputSelectTypeProps>) => {
  const { words, onChange, children, empty, placeholder } = props

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return
    }

    const value = event.currentTarget.value

    const values = value.split(' ')
    const parsedValues = []

    for (const _value of values) {
      const parsedValue = _value.trim().toLowerCase()
      if (parsedValue.length > 0 && !words.includes(parsedValue)) {
        parsedValues.push(parsedValue)
      }
    }

    if (parsedValues.length > 0) {
      onChange([...words, ...parsedValues])
      event.currentTarget.value = ''
    }
  }

  const handleRemoveWord = (word: string) => {
    const newWords = words.filter((_word) => _word !== word)
    onChange(newWords)
  }

  return (
    <FlexColumn style={{ gap: 5 }}>
      {children && (
        <label
          style={{
            color: 'grey',
            fontSize: '13px',
            marginLeft: '5px',
          }}
        >
          {children}
        </label>
      )}
      <Input onKeyDown={handleKeyDown} placeholder={placeholder} />
      <Flex style={{ gap: 5, flexWrap: 'wrap' }}>
        {words.length > 0 ? (
          words.map((word) => (
            <Flex key={word} className={wordStyle}>
              <button onClick={() => handleRemoveWord(word)}>
                <BsPlus />
              </button>
              <span>{word}</span>
            </Flex>
          ))
        ) : (
          <span
            className={css({
              fontSize: '13px',
              marginLeft: '5px',
              color: 'fonts.special',
            })}
          >
            {empty ? empty : 'Empty, add new one.'}
          </span>
        )}
      </Flex>
    </FlexColumn>
  )
}

export { InputSelectType }
