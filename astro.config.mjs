import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import UnoCSS from 'unocss/astro';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: 'https://digibilder.se',

  integrations: [UnoCSS({
    injectReset: true
  }), sitemap()],

  adapter: cloudflare()
});