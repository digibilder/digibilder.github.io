import { defineConfig } from 'astro/config';
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import UnoCSS from 'unocss/astro';
import qwikdev from "@qwikdev/astro";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [UnoCSS({
    injectReset: true // or a path to the reset file
  }), sitemap(), qwikdev()]
});