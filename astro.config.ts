import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

import { site } from './src/config/site';

// Every page is prerendered. The adapter exists so the Contact endpoint can opt
// out of prerendering later with `export const prerender = false`.
export default defineConfig({
  site: site.url,
  output: 'static',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});
