import { PanelApi } from '@pynspel/types'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

const panelAtom = atom<PanelApi | null>({
  key: 'CURRENT_PANEL',
  default: null,
})

export const useCurrentPanelValue = () => useRecoilValue(panelAtom)
export const useSetCurrentPanel = () => useSetRecoilState(panelAtom)
export const useCurrentPanel = () => useRecoilState(panelAtom)
