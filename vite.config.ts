import viteReact from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Use dynamic import for ESM-only plugins to avoid require() errors when Vite loads the config.
export default defineConfig({
  server: { port: 3000 },
  plugins: [
    tsconfigPaths(),
    tanstackStart({
      vite: { installDevServerMiddleware: true },
    }),
    viteReact(),
  ],
  assetsInclude: ['**/*.md'],
  ssr: {
    noExternal: ["react-use", "imgbb-uploader"],
  },
  optimizeDeps: {
    include: ["react-use", "imgbb-uploader"],
  },
});
