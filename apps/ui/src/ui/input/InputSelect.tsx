import {
  Dispatch,
  MouseEvent,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react'
import { BsChevronDown, BsPlus } from 'react-icons/bs'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { css } from '../../../styled-system/css'

type Option = PropertyKey | null

interface Props<Value> extends PropsWithChildren {
  options: Item[]
  value: Value
  setValue: Dispatch<SetStateAction<Value>>
  multi?: boolean
}

type Item = {
  value: PropertyKey
  label: PropertyKey
}

const styles = css({
  gap: '5px',
  '& label': {
    color: 'grey',
    fontSize: '13px',
    marginLeft: '5px',
  },

  '& .wrapper': {
    pos: 'relative',
  },
})

const svgDropDownStyle = css({
  pos: 'absolute',
  right: '20px',
  translate: '0 -50%',
  top: '50%',
})

const pickerStyles = css({
  color: 'white',
  backgroundColor: '#2b2929',
  padding: '10px',
  borderRadius: '10px',
  minHeight: '50px',
  // bg: 'red',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  flexWrap: 'wrap',
})

const ulStyles = css({
  backgroundColor: '#2b2929',
  padding: '5px',
  borderRadius: '10px',
  color: 'white',
  transition: '0.3s',

  '& li': {
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.3s',
    padding: '10px',

    _hover: {
      bg: '#323030',
    },
  },

  '& li:not(:nth-child(1))': {
    marginTop: '5px',
  },
})

const multiWordStyle = css({
  bg: '#B4459530',
  padding: '2px 4px',
  rounded: '5px',
  color: '#B44595',

  '& button': {
    color: '#B44595',
    transition: '0.4s',
    cursor: 'pointer',
    _hover: {
      color: 'white',
    },
  },

  '& svg': {
    rotate: '45deg',
  },
})

const InputSelect = <Value extends Option>(props: Props<Value>) => {
  const { children, options, value, setValue, multi = false } = props
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen((prevV) => !prevV)
  }

  const handleElementClicked = (item: Item) => {
    if (item.value === value) return

    setIsOpen(false)

    if (!multi) {
      return setValue(item.value)
    }

    setValue((prevV) => {
      if (prevV === null) {
        return [item.value]
      }

      if (prevV.includes(item.value)) {
        return prevV
      }

      return [...prevV, item.value]
    })
  }

  const getItemLabelByValue = (value: string) => {
    const item = options.find((el) => el.value === value)
    return item ? item.label : ''
  }

  const handleRemoveItem = (
    e: MouseEvent<HTMLButtonElement>,
    value: string
  ) => {
    if (!multi) return

    e.stopPropagation()

    setValue((prevValues) => {
      return prevValues.filter((prevV) => prevV !== value)
    })
  }

  return (
    <FlexColumn className={styles}>
      <label>{children}</label>
      <div onClick={handleClick} className="wrapper">
        <div
          style={isOpen ? { border: '1px solid rgb(77, 76, 76)' } : {}}
          className={pickerStyles}
        >
          {value === null
            ? 'Select...'
            : !multi
            ? getItemLabelByValue(value as string)
            : Array.isArray(value)
            ? value.length > 0
              ? value.map((value) => (
                  <Flex className={multiWordStyle} style={{ gap: 5 }}>
                    <span key={value}>{getItemLabelByValue(value)}</span>
                    <button onClick={(e) => handleRemoveItem(e, value)}>
                      <BsPlus />
                    </button>
                  </Flex>
                ))
              : 'Vide...'
            : null}
        </div>
        <BsChevronDown
          className={svgDropDownStyle}
          style={
            isOpen
              ? { transform: 'rotate(180deg)', color: 'white' }
              : { color: 'white' }
          }
        />
      </div>

      {isOpen ? (
        <ul className={ulStyles}>
          {options.map((item) => (
            <li
              onClick={() => handleElementClicked(item)}
              key={String(item.value)}
            >
              {String(item.label)}
            </li>
          ))}
        </ul>
      ) : null}
    </FlexColumn>
  )
}

export { InputSelect }
