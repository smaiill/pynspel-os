import React from 'react'
import { RecipeVariantProps, css, cva } from '../../../../../styled-system/css'
import { AlertCircle, Check } from 'lucide-react'
import { Flex } from '~/layouts/Flex'

const toastRecipe = cva({
  base: {
    p: '10px 15px',
    rounded: '5px',
    alignItems: 'center',
    gap: 10,
    backdropFilter: 'blur(2px)',
    animation: '.5s enter',
  },

  variants: {
    visual: {
      success: {
        bgColor: '#04FF0030',
        color: '#79DA76',
        border: '1px solid #79DA7610',
      },
      error: {
        bgColor: '#FF000030',
        color: '#DA7676',
        border: '1px solid #DA767610',
      },
    },
  },
})

type ToastRecipe = RecipeVariantProps<typeof toastRecipe>
export type ToastVisual = Exclude<
  ToastRecipe extends infer AV
    ? AV extends object
      ? AV[keyof AV & 'visual']
      : never
    : never,
  undefined
>

type Props = {
  visual: ToastVisual
  content: JSX.Element | string
  noIcon?: boolean
}

const Icons = {
  error: <AlertCircle color="red" size={17} />,
  success: <Check color="green" size={17} />,
}

const PxToast = (props: Props) => {
  const { visual, content, noIcon } = props
  return (
    <Flex className={toastRecipe({ visual })}>
      {!noIcon && Icons[visual]}
      <span>{content}</span>
    </Flex>
  )
}

export const PxToastError = (props: Pick<Props, 'content' | 'noIcon'>) => {
  return <PxToast visual="error" {...props} />
}

export const PxToastSuccess = (props: Pick<Props, 'content' | 'noIcon'>) => {
  return <PxToast visual="success" {...props} />
}
