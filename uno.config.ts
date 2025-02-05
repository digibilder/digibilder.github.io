// uno.config.ts
import { defineConfig } from 'unocss';
import { presetAttributify, presetUno, presetIcons } from 'unocss'

export default defineConfig({
  presets: [ presetUno(), presetIcons(),
    presetAttributify
  ],
})