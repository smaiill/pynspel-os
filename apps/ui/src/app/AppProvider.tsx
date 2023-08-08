import { ModuleStateApi } from '@pynspel/types'
import { useQuery } from '@tanstack/react-query'
import React, { PropsWithChildren } from 'react'
import { fetchApi } from '~/utils/fetchApi'

export const AppProvider = (props: PropsWithChildren) => {
  const { children } = props

  return children
}
