import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import UnoCSS from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: 'https://digibilder.se',
  integrations: [UnoCSS({
    injectReset: true
  }), sitemap()]
});