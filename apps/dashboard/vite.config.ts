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

const isProductionBuild = Boolean(process.env.CI || process.env.VERCEL);
const enableSentry = Boolean(process.env.SENTRY_AUTH_TOKEN && isProductionBuild);
const enableDevtools = process.env.NODE_ENV !== 'production';

const config = defineConfig({
  build: {
    sourcemap: enableSentry,
    target: 'es2022',
    rollupOptions: {
      external: [/\.wasm$/],
    },
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    ...(enableDevtools
      ? [
          devtools({
            eventBusConfig: {
              port: 1235,
              debug: false,
            },
            enhancedLogs: {
              enabled: true,
            },
          }),
        ]
      : []),
    ...(enableSentry
      ? [
          sentryTanstackStart({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            telemetry: false,
            sourcemaps: {
              disable: false,
            },
          }),
        ]
      : []),
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
      compatibilityDate: '2026-04-06',
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
  },
  ssr: {
    noExternal: [],
  },
  server: {
    allowedHosts: process.env.ALLOWED_HOSTS?.split(',') || [],
  },
});

export default config;
