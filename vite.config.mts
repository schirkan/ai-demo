import viteReact from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Use dynamic import for ESM-only plugins to avoid require() errors when Vite loads the config.
export default defineConfig({
  server: { port: 3000 },
  plugins: [
    tsconfigPaths(),
    tanstackStart(),
    viteReact(),
  ],
  // css: {
  //   modules: {
  //     // Use local scoping by default and a readable generated name for dev.
  //     scopeBehaviour: 'local',
  //     generateScopedName: process.env.NODE_ENV === 'production'
  //       ? '[hash:base64:8]'
  //       : '[name]__[local]__[hash:base64:5]',
  //   },
  //   // You can add preprocessorOptions here if needed (e.g., for sass)
  //   preprocessorOptions: {},
  // },
  assetsInclude: ['**/*.md'],
  ssr: {
    noExternal: ["react-use", "imgbb-uploader"],
  },
  optimizeDeps: {
    include: ["react-use", "imgbb-uploader"],
  },
});
