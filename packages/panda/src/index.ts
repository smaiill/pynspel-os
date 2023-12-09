import { definePreset } from '@pandacss/dev'
import { tokens } from 'theme/tokens'

type Preset = ReturnType<typeof definePreset>

export const pynspelPreset: Preset = definePreset({
  theme: {
    extend: {
      tokens,
    },
  },
})
