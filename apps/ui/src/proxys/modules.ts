import { atom, useRecoilState } from 'recoil'

const globalModules = atom<any>({
  key: 'GLOBAL_MODULES',
  default: [],
})

export const useGlobalModulesState = () => useRecoilState(globalModules)
