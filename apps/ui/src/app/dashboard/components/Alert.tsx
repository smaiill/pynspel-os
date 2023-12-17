import { HTMLAttributes, PropsWithChildren } from 'react'
import { Flex } from '~/layouts/Flex'
import { cva, cx, RecipeVariantProps } from '../../../../styled-system/css'

const alertRecipe = cva({
  base: {
    p: '15px',
    py: '10px',
    bgColor: 'white',
    width: '100%',
    gap: 10,
    textAlign: 'start',
    alignItems: 'center',
    color: 'white',
    '& svg': {
      minW: '50px',
    },
  },

  variants: {
    visual: {
      danger: {
        bg: 'rgba(255, 0, 0, .06)',
        border: '1px solid rgba(255, 0, 0, .1)',
        color: 'red.200',
      },
      info: {
        bg: 'rgba(26, 206, 186, .06)',
        border: '1px solid rgba(26, 206, 186, .1)',
        color: 'blue.200',
      },
      warn: {
        bg: 'rgba(206, 152, 26, .06)',
        border: '1px solid rgba(206, 152, 26, .1)',
        color: 'orange.200',
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
} & HTMLAttributes<HTMLDivElement>

export const Alert = (props: PropsWithChildren<Props>) => {
  const { visual, children, className, ...rest } = props

  return (
    <Flex
      {...rest}
      className={cx(
        alertRecipe({
          visual,
        }),
        className
      )}
    >
      {children}
    </Flex>
  )
}
