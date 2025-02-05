import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import UnoCSS from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
  output: "static",
  // We don't need base with custom domain
  site: 'https://digibilder.se', // Set your site URL
  // experimental: {
  //   actions: true,
  // },
  integrations: [UnoCSS({
    injectReset: true // or a path to the reset file
  }), sitemap()]
});