import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  watch: true,
  dts: true,
  format: ['cjs', 'esm'],
})
