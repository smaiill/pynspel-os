import {
  CSSProperties,
  Dispatch,
  MouseEvent,
  PropsWithChildren,
  SetStateAction,
  useState,
} from 'react'
import { BsChevronDown, BsPlus } from 'react-icons/bs'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { css } from '../../../styled-system/css'
import { Check } from 'lucide-react'

type Option = PropertyKey | null

interface Props<Value, Multi> extends PropsWithChildren {
  options: Item[]
  value: Value
  multi?: Multi
  setValue: Multi extends never | false
    ? Dispatch<SetStateAction<Value>>
    : Dispatch<SetStateAction<string[]>>

  onChange?: (value: Value) => void
}

type Item = {
  value: PropertyKey
  label: PropertyKey
}

const styles = css({
  gap: '5px',
  width: '100%',
  position: 'relative',
  userSelect: 'none',

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
  cursor: 'pointer',
  transition: '.3s',
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
  cursor: 'pointer',
})

const ulStyles = css({
  backgroundColor: '#2b2929',
  padding: '5px',
  borderRadius: '10px',
  color: 'white',
  transition: '0.3s',
  position: 'absolute',
  top: '80px',
  zIndex: 9999999999,
  width: '100%',
  border: '1px solid rgb(77, 76, 76)',

  '& li': {
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.3s',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    '& svg': {
      color: 'special',
    },
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

const InputSelect = <Value extends Option, Multi extends boolean>(
  props: Props<Value, Multi>
) => {
  const { children, options, value, setValue, multi } = props
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

  const isSelected = (itemValue: string) =>
    Boolean(multi ? value?.includes(itemValue) : itemValue === value)

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
          {options.map((item) => {
            const _selected = isSelected(item.value)
            return (
              <li
                style={_selected ? { backgroundColor: '#1F1F1F' } : {}}
                onClick={() => handleElementClicked(item)}
                key={String(item.value)}
              >
                {String(item.label)}
                {_selected ? <Check size={12} /> : null}
              </li>
            )
          })}
        </ul>
      ) : null}
    </FlexColumn>
  )
}

export { InputSelect }
