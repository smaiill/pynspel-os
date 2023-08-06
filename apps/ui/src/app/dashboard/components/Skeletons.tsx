import React, { PropsWithChildren } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'

const BASE_COLOR = '#202020'
const HIGHLIGHT_COLOR = '#444'

export const SkeletonBox = () => {
  return (
    <SkeletonTheme
      height={100}
      baseColor={BASE_COLOR}
      highlightColor={HIGHLIGHT_COLOR}
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
