import { Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import { FlexColumn } from '~/layouts/Flex'
import { css } from '../../../styled-system/css'

type ItemValue = string | string[] | null

interface Props extends PropsWithChildren {
  options: Item[]
  value: ItemValue
  setValue: Dispatch<SetStateAction<ItemValue>>
  onChange?: (item: Item) => void
  multi?: boolean
  label: string
}

type Item = {
  value: string
  label: string
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

    '& svg': {
      pos: 'absolute',
      right: '20px',
      translate: '0 -50%',
      top: '50%',
    },
  },
})

const pickerStyles = css({
  color: 'white',
  backgroundColor: '#2b2929',
  padding: '10px',
  borderRadius: '10px',
  height: '50px',
  // bg: 'red',
  display: 'flex',
  alignItems: 'center',
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

const InputSelect = (props: Props) => {
  const { children, options, value, setValue, multi = false } = props
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen((prevV) => !prevV)
  }

  console.log({ value })

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
            ? value.map((value) => (
                <span key={value}>{getItemLabelByValue(value)}</span>
              ))
            : null}
        </div>
        <BsChevronDown
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
            <li onClick={() => handleElementClicked(item)} key={item.value}>
              {item.label}
            </li>
          ))}
        </ul>
      ) : null}
    </FlexColumn>
  )
}

export { InputSelect }
