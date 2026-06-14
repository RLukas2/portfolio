import path from 'node:path';
import babel from '@rolldown/plugin-babel';
import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

dotenv.config({
  path: path.resolve(import.meta.dirname, '../../.env'),
});

const config = defineConfig({
  build: {
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      // Keep shiki and its sub-packages external so Rolldown never tries to bundle the .wasm file
      external: [/^shiki/, /^@shikijs\//, /\.wasm$/],
      // manualChunks intentionally omitted: split chunks break CJS-ESM interop
      // in TanStack Start's SSR environment (Rolldown wraps CommonJS lazy getters
      // instead of calling them, causing "__toESM(...).default" to be undefined).
    },
    // Increase chunk size warning limit for vendor chunks
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    devtools({
      eventBusConfig: {
        port: 1234,
        debug: false,
      },
      enhancedLogs: {
        enabled: true,
      },
    }),
    sentryTanstackStart({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      telemetry: false,
      sourcemaps: {
        disable: false,
      },
    }),
    tanstackStart({
      srcDirectory: './src',
      start: {
        entry: './start.tsx',
      },
      server: {
        entry: './server.ts',
      },
      router: {
        quoteStyle: 'double',
        semicolons: true,
        routeToken: 'layout',
      },
    }),
    nitro({
      compatibilityDate: 'latest',
      preset: process.env.VERCEL ? 'vercel' : 'node',
    }),
    viteReact(),
    babel({
      presets: [reactCompilerPreset({ target: '19' })],
    }),
  ],
  optimizeDeps: {
    entries: ['src/**/*.{ts,tsx}'],
    include: ['react', 'react-dom', '@tanstack/react-router', '@tanstack/react-query'],
    exclude: ['posthog-js', '@posthog/react', 'framer-motion', 'shiki', '@shikijs/rehype', '@shikijs/transformers'],
  },
  ssr: {
    noExternal: [],
    external: ['shiki', '@shikijs/rehype', '@shikijs/transformers'],
  },
  server: {
    allowedHosts: process.env.ALLOWED_HOSTS?.split(',') || [],
  },
});

export default config;
