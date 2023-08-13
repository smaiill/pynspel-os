import { HTMLAttributes, PropsWithChildren } from 'react'
import { cva, RecipeVariantProps } from '../../../styled-system/css'

const chipRecipe = cva({
  base: {
    padding: '5px',
    fontSize: '12px',
    rounded: '13px',
  },
  variants: {
    visual: {
      warn: {
        color: 'fonts.warn',
        border: '1px solid #e5871a',
        bgColor: '#e5871a10',
      },
      success: {
        color: 'success',
        border: '1px solid #3d8b2e',
        bgColor: '#3d8b2e10',
      },
      danger: {
        color: 'red.500',
        border: '1px solid red',
        bg: 'rgba(255, 0, 0, .1)',
      },
    },
  },
})

type ChipVariants = RecipeVariantProps<typeof chipRecipe>

type ChipVisual = Exclude<
  ChipVariants extends infer AV
    ? AV extends object
      ? AV[keyof AV & 'visual']
      : never
    : never,
  undefined
>

type ChipProps = {
  visual: ChipVisual
} & PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export const Chip = (props: ChipProps) => {
  const { children, visual, ...rest } = props

  return (
    <div {...rest} className={chipRecipe({ visual })}>
      {children}
    </div>
  )
}
