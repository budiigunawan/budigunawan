import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { siteProfile } from './src/data/site';

export default defineConfig({
  site: siteProfile.siteUrl,
  output: 'static',
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
