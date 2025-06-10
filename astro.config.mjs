// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

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

  integrations: [react()],
  adapter: vercel()
});