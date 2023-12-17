import clsx from 'clsx'
import { Check } from 'lucide-react'
import {
  Dispatch,
  MouseEvent,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import { BsChevronDown, BsPlus } from 'react-icons/bs'
import { Hashtag } from '~/icons/Hashtag'
import { Flex, FlexColumn } from '~/layouts/Flex'
import { css, cx } from '../../../styled-system/css'

type Option = PropertyKey | null | PropertyKey[]
type InputSelectTypes = 'role' | 'channel' | 'default'

export interface InputSelectProps<Value, Multi, Type>
  extends PropsWithChildren {
  options: Type extends 'role' ? ItemRole[] : Item[]
  value: Value
  multi?: Multi
  setValue: Multi extends true
    ? Dispatch<SetStateAction<string[]>>
    : Dispatch<SetStateAction<Value>>

  onChange?: (
    value: Multi extends true
      ? Dispatch<SetStateAction<string[]>>
      : Dispatch<SetStateAction<Value>>
  ) => void
  type?: Type
  className?: string
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
  right: '10px',
  translate: '0 -50%',
  top: '50%',
  cursor: 'pointer',
  transition: '.3s',
})

const pickerStyles = css({
  color: 'white',
  bg: 'news.backgrounds.tertiary',
  padding: '10px',
  minHeight: '50px',
  // bg: 'red',
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  flexWrap: 'wrap',
  cursor: 'pointer',
  minW: '75px',
})

const ulStyles = css({
  bg: 'news.backgrounds.tertiary',
  padding: '5px',
  color: 'white',
  transition: '0.3s',
  position: 'absolute',
  top: '80px',
  zIndex: 999999999999999,
  width: '100%',
  border: '1px solid rgb(77, 76, 76)',
  maxHeight: '250px',
  overflowY: 'auto',
  animation: '.3s fadeIn',

  '& li': {
    cursor: 'pointer',
    transition: '0.3s',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    '&.selected': {
      bg: 'white',
      color: 'black !important',
    },

    '& svg': {
      color: 'special',
    },
    _hover: {
      bg: 'news.backgrounds.secondary',
    },
  },

  '& li:not(:nth-child(1))': {
    marginTop: '5px',
  },
})

const multiWordStyle = css({
  bg: 'white',
  padding: '2px 4px',
  color: 'black',

  '& button': {
    color: 'black',
    transition: '0.4s',
    cursor: 'pointer',
    _hover: {
      color: 'red',
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
  const {
    children,
    options,
    value,
    setValue,
    multi,
    type = 'default',
    className,
  } = props
  const ulRef = useRef<HTMLUListElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen((prevV) => !prevV)
  }

  const handleElementClicked = (item: Item) => {
    if (item.value === value) return

    setIsOpen(false)

    if (!multi) {
      return setValue(
        item.value as unknown as SetStateAction<string[]> &
          SetStateAction<Value>
      )
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
    return item ? item.label : null
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

  useEffect(() => {
    if (!multi) {
      const item = getItemLabelByValue(props.value)

      if (!item) {
        setValue(null)
      }
    }
  }, [])

  return (
    <FlexColumn className={styles}>
      <label>{children}</label>
      <div onClick={handleClick} className="wrapper">
        <div
          style={isOpen ? { border: '1px solid rgb(77, 76, 76)' } : {}}
          className={cx(pickerStyles, className)}
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
          {options.map((item, idx) => {
            const _selected = isSelected(item.value)

            const classx = clsx(_selected && 'selected')

            return (
              <li
                onClick={() => handleElementClicked(item)}
                key={String(item.value)}
                className={classx}
                style={{
                  ...(type === 'role'
                    ? {
                        color:
                          item.color === 0
                            ? 'grey'
                            : `#${item.color.toString(16)}`,
                      }
                    : {}),
                }}
              >
                {type === 'channel' ? (
                  <Flex
                    style={{
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Hashtag />
                    {item.label}
                  </Flex>
                ) : (
                  item.label
                )}
                {_selected ? <Check color="black" size={15} /> : null}
              </li>
            )
          })}
        </ul>
      ) : null}
    </FlexColumn>
  )
}

export { InputSelect }
