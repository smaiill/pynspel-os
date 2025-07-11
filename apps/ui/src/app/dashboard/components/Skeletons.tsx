import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const BASE_COLOR = '#202020'
const HIGHLIGHT_COLOR = '#444'

export const SkeletonBox = ({
  height = 100,
  width = '100%',
  inline = false,
}: {
  height?: number
  width?: number | string
  inline?: boolean
}) => {
  return (
    <SkeletonTheme
      height={height}
      baseColor={BASE_COLOR}
      highlightColor={HIGHLIGHT_COLOR}
      width={width}
      inline={inline}
    >
      <Skeleton />
    </SkeletonTheme>
  )
}

type SkeletonEdgeProps = {
  size?: number
}

export const SkeletonEdge = ({ size = 1 }: SkeletonEdgeProps) => {
  return (
    <SkeletonTheme
      height={50 * (size / 1.5)}
      width={50 * (size / 1.5)}
      baseColor={BASE_COLOR}
      highlightColor={HIGHLIGHT_COLOR}
    >
      <Skeleton />
    </SkeletonTheme>
  )
}

export const SkeletonTitle = () => {
  return (
    <SkeletonTheme
      height={40}
      baseColor={BASE_COLOR}
      highlightColor={HIGHLIGHT_COLOR}
    >
      <Skeleton />
    </SkeletonTheme>
  )
}

export const SkeletonCustom = ({ hSize = 2 }: { hSize?: number }) => {
  return (
    <SkeletonTheme
      height={100 * (hSize / 1.5)}
      baseColor={BASE_COLOR}
      highlightColor={HIGHLIGHT_COLOR}
    >
      <Skeleton />
    </SkeletonTheme>
  )
}
