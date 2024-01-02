import { atom, useRecoilState, useSetRecoilState } from 'recoil'

const globalModules = atom<any>({
  key: 'GLOBAL_MODULES',
  default: [],
})

export const useGlobalModulesState = () => useRecoilState(globalModules)
export const useSetGlobalModules = () => useSetRecoilState(globalModules)
