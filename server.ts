import express from 'express';
import { toNodeHandler } from 'srvx/node';
import socketMiddleware from './socket';

// see https://github.com/TanStack/router/tree/main/e2e/react-start/custom-basepath

const DEVELOPMENT = process.env.NODE_ENV === 'development';
const PORT = Number.parseInt(process.env.PORT || '3000');

const app = express();

// Mount socket middleware early so it can attach Socket.IO to the underlying HTTP server.
// The middleware is idempotent and will no-op if socket.io is already initialized.
app.use(socketMiddleware);

if (DEVELOPMENT) {
  const viteDevServer = await import('vite').then((vite) =>
    vite.createServer({
      server: { middlewareMode: true },
    }),
  );
  app.use(viteDevServer.middlewares);
  app.use(async (req, res, next) => {
    try {
      const { default: serverEntry } = await viteDevServer.ssrLoadModule('./src/server.ts');
      const handler = toNodeHandler(serverEntry.fetch);
      await handler(req as any, res as any);
    } catch (error) {
      if (typeof error === 'object' && error instanceof Error) {
        viteDevServer.ssrFixStacktrace(error);
      }
      next(error);
    }
  });
} else {
  const { default: handler } = await import('./dist/server/server.js');
  const nodeHandler = toNodeHandler(handler.fetch);
  app.use(express.static('dist/client'));
  app.use(async (req, res, next) => {
    try {
      await nodeHandler(req as any, res as any);
    } catch (error) {
      next(error);
    }
  });
}

app.listen(PORT, () => {
  console.log(process.env.NODE_ENV + ` Server is running on http://localhost:${PORT}`);
});
