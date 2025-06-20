// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import favicons from 'astro-favicons';
import sitemap from '@astrojs/sitemap';
// https://astro.build/config
export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: fontProviders.fontsource(),
        name: 'Inter',
        weights: ['400', '600'],
        cssVariable: '--font-sans'
      },
      {
        provider: fontProviders.google(),
        name: 'Bebas Neue',
        cssVariable: '--font-heading'
      }
    ]
  },

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), favicons(), sitemap()],
  adapter: netlify()
});