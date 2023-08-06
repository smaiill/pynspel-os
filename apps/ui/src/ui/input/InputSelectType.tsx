import { KeyboardEvent } from 'react'
import { BsPlus } from 'react-icons/bs'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { Input } from '~/ui/input/Input'
import { css } from '../../../styled-system/css'

type InputSelectTypeProps = {
  words: string[]
  onChange(words: string[]): void
}

const wordStyle = css({
  bg: '#B4459530',
  padding: '1px 4px',
  rounded: '5px',
  alignItems: 'center',
  gap: '5px',

  '& span ': {
    color: '#B44595',
  },

  '& button': {
    stroke: 'red',
    color: '#B44595',
    transition: '0.4s',
    cursor: 'pointer',

    _hover: {
      color: 'white',
    },

    '& svg': {
      rotate: '45deg',
      fontSize: '20px',
    },
  },
})

const InputSelectType = (props: InputSelectTypeProps) => {
  const { words, onChange } = props

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
      <Input onKeyDown={handleKeyDown} placeholder="e.x: Sal*pe" />
      <Flex style={{ gap: 5, flexWrap: 'wrap' }}>
        {words.map((word) => (
          <Flex key={word} className={wordStyle}>
            <span>{word}</span>
            <button onClick={() => handleRemoveWord(word)}>
              <BsPlus />
            </button>
          </Flex>
        ))}
      </Flex>
    </FlexColumn>
  )
}

export { InputSelectType }
