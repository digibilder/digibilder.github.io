import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import UnoCSS from 'unocss/astro';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: 'https://digibilder.se',

  // Configure images to use compile mode for Cloudflare compatibility
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        // Preprocess images at build time instead of on-demand
        mode: 'compile'
      }
    }
  },

  integrations: [UnoCSS({
    injectReset: true
  }), sitemap()],

  adapter: cloudflare({
    // Enable local runtime for better development experience
    platformProxy: {
      enabled: true,
    },
  })
});