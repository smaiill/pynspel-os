import {
  CSSProperties,
  Dispatch,
  MouseEvent,
  PropsWithChildren,
  SetStateAction,
  useRef,
  useState,
} from 'react'
import { BsChevronDown, BsPlus } from 'react-icons/bs'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { css, cx } from '../../../styled-system/css'
import { Check } from 'lucide-react'
import { SystemStyleObject } from '../../../styled-system/types'
import clsx from 'clsx'
import { decimalToHex } from '@pynspel/utils'
import { Hashtag } from '~/icons/Hashtag'

type Option = PropertyKey | null
type InputSelectTypes = 'role' | 'channel' | 'default'

export interface InputSelectProps<Value, Multi, Type>
  extends PropsWithChildren {
  options: Type extends 'role' ? ItemRole[] : Item[]
  value: Value
  multi?: Multi
  setValue: Multi extends never | false
    ? Dispatch<SetStateAction<Value>>
    : Dispatch<SetStateAction<string[]>>

  onChange?: (value: Value) => void
  type?: Type
}

type Item = {
  value: PropertyKey
  label: PropertyKey
}

type ItemRole = {
  value: string
  label: string
  color: string
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
  maxHeight: '250px',
  overflowY: 'auto',
  animation: '.3s fadeIn',

  '& li': {
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.3s',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    '&.selected': {
      bgColor: '#1F1F1F',
    },

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
  bg: 'specialBg',
  padding: '2px 4px',
  rounded: '5px',
  color: 'special',

  '& button': {
    color: 'special',
    transition: '0.4s',
    cursor: 'pointer',
    _hover: {
      color: 'white',
    },
  },

  '& svg': {
    rotate: '45deg',
    fontSize: '20px',
    marginTop: '1px',
  },
})

const InputSelect = <
  Value extends Option,
  Multi extends boolean,
  Type extends InputSelectTypes = 'default'
>(
  props: InputSelectProps<Value, Multi, Type>
) => {
  const { children, options, value, setValue, multi, type = 'default' } = props
  const ulRef = useRef<HTMLUListElement>(null)
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
    return item ? item.label : 'Valeur Invalide'
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

  // TODO: When i set a channel and removes it on discord, the value in the select is an empty string,
  // TODO: Correct that and put a message error in red;

  return (
    <FlexColumn className={styles}>
      <label>{children}</label>
      <div onClick={handleClick} className="wrapper">
        <div
          style={isOpen ? { border: '1px solid rgb(77, 76, 76)' } : {}}
          className={pickerStyles}
        >
          {value === null ? (
            'Select...'
          ) : !multi ? (
            type === 'channel' ? (
              <Flex
                style={{
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Hashtag />
                {getItemLabelByValue(value as string)}
              </Flex>
            ) : (
              getItemLabelByValue(value as string)
            )
          ) : Array.isArray(value) ? (
            value.length > 0 ? (
              value.map((value) => (
                <Flex className={multiWordStyle} style={{ gap: 5 }}>
                  <button onClick={(e) => handleRemoveItem(e, value)}>
                    <BsPlus />
                  </button>
                  <span key={value}>{getItemLabelByValue(value)}</span>
                </Flex>
              ))
            ) : (
              'Vide...'
            )
          ) : null}
        </div>
        <BsChevronDown
          className={svgDropDownStyle}
          style={
            isOpen
              ? { transform: 'rotate(180deg)', color: 'grey' }
              : { color: 'grey' }
          }
        />
      </div>

      {isOpen ? (
        <ul ref={ulRef} className={ulStyles}>
          {options.map((item) => {
            const _selected = isSelected(item.value)

            const classx = clsx(_selected && 'selected')

            return (
              <li
                onClick={() => handleElementClicked(item)}
                key={String(item.value)}
                className={classx}
                style={
                  type === 'role'
                    ? {
                        color:
                          item.color === 0
                            ? 'grey'
                            : `#${item.color.toString(16)}`,
                      }
                    : {}
                }
              >
                {type === 'channel' ? (
                  <Flex
                    style={{
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Hashtag />
                    {String(item.label)}
                  </Flex>
                ) : (
                  String(item.label)
                )}
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
