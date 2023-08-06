import React, { PropsWithChildren } from 'react'
import { RecipeVariantProps, css, cva } from '../../../../styled-system/css'
import { AlertCircle, Info, LucideIcon } from 'lucide-react'
import { Flex } from '~/layouts/Flex'

const alertRecipe = cva({
  base: {
    p: '15px',
    py: '10px',
    bgColor: 'white',
    width: '100%',
    rounded: '10px',
    gap: 10,
    alignItems: 'center',

    '& svg': {
      minW: '50px',
    },
  },

  variants: {
    visual: {
      danger: {
        bgColor: 'rgba(255, 0, 0, .1)',
        color: 'rgb(244, 199, 199)',
        border: '1px solid rgba(244, 199, 199, .2)',
      },
      info: {
        bgColor: '#678BD850',
        color: '#98A8CC',
        border: '1px solid #98A8CC20',
      },
    },
  },
})

type AlertVariants = RecipeVariantProps<typeof alertRecipe>

type VisualKeys = Exclude<
  AlertVariants extends infer AV
    ? AV extends object
      ? AV[keyof AV & 'visual']
      : never
    : never,
  undefined
>

type Props = {
  visual: VisualKeys
}

export const Alert = (props: PropsWithChildren<Props>) => {
  const { visual, children } = props

  return (
    <Flex
      className={alertRecipe({
        visual,
      })}
    >
      <span>{children}</span>
    </Flex>
  )
}
