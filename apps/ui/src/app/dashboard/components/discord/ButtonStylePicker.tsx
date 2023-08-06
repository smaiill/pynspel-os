import { useState } from 'react'
import { Flex } from '~/layouts/Flex'

const COLORS = [
  {
    color: '#5865F2',
    style: 1,
  },
  {
    color: '#4F545C',
    style: 2,
  },
  {
    color: '#43B581',
    style: 3,
  },
  {
    color: '#F04747',
    style: 4,
  },
] as const

type ButtonStylePicker = {
  style: number
  color: string
}

type ButtonStylePickerProps = {
  onChange: ({ color, style }: ButtonStylePicker) => void
  default?: number
}

export const ButtonStylePicker = (props: ButtonStylePickerProps) => {
  const { default: defaultSelected, onChange } = props
  const [selected, setSelected] = useState(defaultSelected)

  const handleClick = (button: ButtonStylePicker) => {
    setSelected(button.style)
    onChange(button)
  }

  return (
    <Flex style={{ gap: 5 }}>
      {COLORS.map((color) => (
        <div
          onClick={() => handleClick(color)}
          style={{
            width: 30,
            height: 30,
            backgroundColor: color.color,
            borderRadius: 10,
            cursor: 'pointer',
            transition: '.1s',
            position: 'relative',
          }}
          key={color.style}
          className="color"
        >
          <div
            style={{
              position: 'absolute',
              translate: '-50% -50%',
              top: '50%',
              left: '50%',
              backgroundColor: 'white',
              width: '15px',
              height: '15px',
              borderRadius: 5,
              transition: '.2s',
              ...(selected === color.style ? { opacity: 1 } : { opacity: 0 }),
            }}
          />
        </div>
      ))}
    </Flex>
  )
}
