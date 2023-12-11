import { AlertCircle, Check } from 'lucide-react'
import { Flex } from '~/layouts/Flex'
import { cva, RecipeVariantProps } from '../../../../../styled-system/css'

const toastRecipe = cva({
  base: {
    p: '10px 15px',
    alignItems: 'center',
    gap: 10,
    backdropFilter: 'blur(5px)',
    animation: '.5s enter',
    pos: 'relative',

    _before: {
      content: '""',
      pos: 'absolute',
      width: '5px',
      height: '100%',
      right: '0',
      top: '0',
    },
  },
  variants: {
    visual: {
      success: {
        bg: '#4CAF5070', // Light green background for success
        color: 'white', // Dark text color for success

        _before: {
          bg: '#4CAF50', // Same as the background for consistency
        },
      },
      error: {
        bg: '#F4433670', // Light red background for error
        color: 'white', // Dark text color for error

        _before: {
          bg: '#F44336', // Same as the background for consistency
        },
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
      <span>{content}</span>
      {!noIcon && Icons[visual]}
    </Flex>
  )
}

export const PxToastError = (props: Pick<Props, 'content' | 'noIcon'>) => {
  return <PxToast visual="error" {...props} />
}

export const PxToastSuccess = (props: Pick<Props, 'content' | 'noIcon'>) => {
  return <PxToast visual="success" {...props} />
}
