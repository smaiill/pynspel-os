import { ModuleStateApi } from '@pynspel/types'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'

const globalModules = atom<ModuleStateApi[]>({
  key: 'GLOBAL_MODULES',
  default: [],
})

export const useGlobalModulesState = () => useRecoilState(globalModules)
export const useSetGlobalModules = () => useSetRecoilState(globalModules)
