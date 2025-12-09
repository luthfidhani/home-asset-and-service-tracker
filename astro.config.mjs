import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
  security: {
    checkOrigin: true
  },
  // Enable View Transitions for SPA-like navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover' // Prefetch on hover for faster perceived navigation
  }
});
