Feature-Spezifikation — Migration: Next.js → TanStack Start (idiomatisch)
---

Kurzfassung
---
Die Migration folgt der idiomatischen TanStack Start-Variante (Option 2): Reorganisation zu route-objects / nested routes, Nutzung von TanStack Start Plugins (Vite) und optionaler Integration von TanStack Query für Data-Fetching/Caching. Ziel ist ein langfristig wartbares, TanStack-konformes Routing-Layout statt eines 1:1-Datei-Mappings.

Konkreter technischer Umfang
---
- Tooling: Vite + @tanstack/react-start plugin, @tanstack/react-router, @vitejs/plugin-react, vite-tsconfig-paths.
- routesDirectory: Setze auf "app" (um Next.js-Konventionen zu erleichtern und gleichzeitig TanStack Start Best Practices zu folgen).
- Folder/Layout-Pattern: Verwende src/app/__root.tsx als Root-Layout, nested layouts für Bereiche; Seiten als createFileRoute / createFileRoute-based components.
- Data layer: Nutze @tanstack/react-query (optional) für Caching; lade daten via Route.loader oder React Query hooks.
- Server functions & API: Nutze TanStack Start server handlers (createServerFn / server.handlers) wo möglich; für komplexe Backends ggf. externes API/Backend.
- Images: Empfehlung: Unpic (@unpic/react) oder vorhandene static images via public/; Image-Optimizing nur bei Bedarf über externen Service.
- No Tailwind: Kein Tailwind installieren oder importieren.

Konkrete Beispiele (Code-Snippets) — direkt anwendbar
---
1) package.json (Scripts)
json
{
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node .output/server/index.mjs",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "test": "vitest"
  }
}

Hinweis: "start" passt je nach gewähltem Hosting an. Für statische Hosting reicht "vite preview" oder ein static-serve. Für Node-Server-Hosting wird die .output/server genutzt.

2) vite.config.ts (empfehlung)
ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: { port: 3000 },
  plugins: [
    tsconfigPaths(),
    tanstackStart({
      srcDirectory: 'src',
      router: { routesDirectory: 'app' },
    }),
    react(),
  ],
})

WICHTIG: Nicht tailwindcss installieren/importieren.

3) src/app/__root.tsx (Root Layout)
tsx
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import appCss from './globals.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'App' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <html lang="de">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}

4) src/app/index.tsx (Home / createFileRoute)
tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main>
      <h1>TanStack Start – Home</h1>
    </main>
  )
}

5) Routing bootstrap (src/router.tsx)
ts
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })
  return router
}

UI-Behandlungen / Layout-Optionen (umgesetzt: idiomatisch)
---
- Nested Layouts (empfohlen): GlobalLayout → Bereichs-Layouts → Pages. Vorteil: klare Hierarchie, Shared UI, granularer Data-Loading.
- Single Root + route-objects: zentrales Route-File mit routeTree.gen, gut für große Apps.

Trade-offs
---
- Mehr initialer Refactor-Aufwand im Vergleich zu 1:1 Mapping, aber deutlich besser skalierbar und konform zur TanStack-Philosophie.
- Typische Next.js Features (Image Opt, next/font, server actions) benötigen Ersatz (Unpic, fontsource, createServerFn).
- SSR/SSG: TanStack Start ist primär client-oriented; wenn SSR benötigt wird, muss ein server-entry oder prerendering-Workflow ergänzt werden.

Migrations-Task-Plan (Schritt-für-Schritt)
---
1. Branch erstellen: migration/migrate-to-tanstack-start
2. Inventory: Erfasse next.config.ts, postcss.*, getServerSideProps/getStaticProps, API-Routen, next/image, next/font.
3. Dependencies: Entferne next, @tailwindcss/postcss; installiere @tanstack/react-start, @tanstack/react-router, vite, @vitejs/plugin-react, vite-tsconfig-paths, ggf. @tanstack/react-query, @unpic/react.
4. Vite config & scripts: Erstelle vite.config.ts wie oben; passe package.json scripts an.
5. Root & Home: Rename / transform src/app/layout.tsx → src/app/__root.tsx, page.tsx → index.tsx (createFileRoute pattern).
6. Router scaffolding: Erzeuge routeTree.gen via plugin; implementiere src/router.tsx.
7. Replace Links/Images: next/link → @tanstack/react-router Link (href → to); next/image → @unpic/react or <img>.
8. Data fetching: getServerSideProps/getStaticProps → Route.loader or React Query hooks / loaders; API-Routen → server.handlers or separate backend.
9. Dev: npm run dev → fix errors → iterate.
10. Cleanup: package.json bereinigen, entferne next-configs, lockfile updaten, CI adjust.
11. Verify: local dev at http://localhost:3000 shows Start welcome/home; run build and preview.

Akzeptanzkriterien (konkret)
---
- Projekt startet mit npm run dev ohne next-Abhängigkeiten.
- Root layout und / route sind nach TanStack Start implementiert (src/app/__root.tsx, src/app/index.tsx).
- package.json scripts nutzen vite; vite.config.ts enthält tanstackStart plugin.
- next-spezifische imports (next/link, next/image, next/font) sind ersetzt oder dokumentiert.
- CI/Deployment Anweisungen aktualisiert.

Nächste Schritte
---
Ich kann nun design.md anpassen und dort konkrete Codebeispiele, eine detaillierte Migrations-Checkliste und ein PoC-Scope (erste Seite migrieren) aufnehmen. Soll ich design.md jetzt entsprechend verfeinern und die code-snippets dort ausführlich aufnehmen?
