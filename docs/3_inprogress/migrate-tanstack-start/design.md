Detailliertes Design — Migration zu TanStack Start (idiomatisch, PoC-fokussiert)
---

Ziel dieses Dokuments
---
Konkrete, umsetzbare Schritte und Beispielcode für ein Proof-of-Concept (PoC): Migration der Root-Layout und der Startseite (/), Einrichtung von Vite + TanStack Start, Anpassung der package.json-Scripts und erste Ersetzungen (Links, Images, Data-loading). Fokus: idiomatische TanStack Start-Umsetzung mit nested routes und route-objects.

PoC-Umfang (klein, sicher, verifizierbar)
---
- Ersetze Root-Layout: src/app/layout.tsx → src/app/__root.tsx (createRootRoute).
- Ersetze Home-Seite: src/app/page.tsx → src/app/index.tsx (createFileRoute('/')).
- Setup Vite + tanstackStart plugin (vite.config.ts).
- Passe package.json scripts an (dev/build/preview/start).
- Ersetze next/link → @tanstack/react-router Link (mind. auf Home / Root).
- Prüfe public/ assets und next/image Nutzung; für PoC: statisches <img /> verwenden oder Unpic für ein Beispiel.
- Start Dev-Server und verifiziere http://localhost:3000.

Konkrete, erweiterte Code-Beispiele
---
1) package.json — Scripts (Vorschlag)
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

Hinweis: "start" ist nur erforderlich für Node-basiertes Hosting; für statische Deploys reicht "vite preview" oder ein static server.

2) vite.config.ts
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

WICHTIG: Nicht tailwindcss installieren oder plugin einfügen.

3) src/app/__root.tsx (vollständigeres Beispiel)
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
        <header>
          <nav>
            {/* Beispiel-Link */}
            {/* <Link to="/">Home</Link> */}
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
        <footer />
        <Scripts />
      </body>
    </html>
  )
}

4) src/app/index.tsx (Home)
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main>
      <h1>TanStack Start – Home</h1>
      <p>Migration Proof-of-Concept</p>
      <img src="/next.svg" alt="Beispielbild" />
    </main>
  )
}

5) src/router.tsx (Bootstrap)
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
  })
  return router
}

6) Hinweise zu häufigen Ersetzungen
- next/link -> import { Link } from '@tanstack/react-router' and use <Link to="/path">.
- next/image -> für PoC: <img src="..." alt="..."/>; optional: install @unpic/react später.
- getServerSideProps/getStaticProps -> Route.loader or use React Query hooks + loaders.
- 'use server' actions -> createServerFn / server.handlers per Guide.

Migrations-Checklist (detailliert)
---
Phase A — Vorbereitung
- [ ] Erstelle Branch migration/migrate-to-tanstack-start
- [ ] Backup / ensure clean working tree / commit outstanding work
- [ ] Dokumentiere Next-spezifische Punkte (next.config, postcss, API-Routes, images, fonts)

Phase B — Bootstrapping
- [ ] Entferne Tailwind-PostCSS-Plugins (falls vorhanden) — NICHT installieren neu
- [ ] package.json: Scripts anpassen (dev/build/preview/start)
- [ ] package.json: entferne next, @tailwindcss/postcss; füge dev-deps (vite, @vitejs/plugin-react, vite-tsconfig-paths) und deps (@tanstack/react-start, @tanstack/react-router) hinzu
- [ ] Erstelle vite.config.ts mit tanstackStart plugin (routesDirectory: 'app')

Phase C — PoC Migration
- [ ] Rename src/app/layout.tsx → src/app/__root.tsx (oder erst kopieren und anpassen)
- [ ] Rename src/app/page.tsx → src/app/index.tsx (oder kopieren + createFileRoute wrapper)
- [ ] Erstelle src/router.tsx und generiere / prüfe routeTree.gen (Plugin generiert)
- [ ] Ersetze next/link auf Home/Root
- [ ] Temporär replace next/image mit <img /> in Home
- [ ] npm run dev -> behebe typscript und import-fehler

Phase D — Iterative Migration
- [ ] Migriere weitere pages → createFileRoute / route objects
- [ ] Migriere API-Routen: kleine server-routes in Start (server.handlers) oder separates Backend je nach Entscheidung
- [ ] Data fetching: loader / React Query Integration
- [ ] Fonts: replace next/font with fontsource or local fonts
- [ ] Tests & Lint: passe Pfade & Scripts an
- [ ] CI/CD: passe Deploy-Scripts (Vercel / Netlify / Cloudflare) an

Phase E — Cleanup & Verify
- [ ] Entferne next.config.* , postcss.config.* , next-abhängige Dateien
- [ ] Entferne next aus package.json Abhängigkeiten
- [ ] Lockfile aktualisieren (npm install / npm ci)
- [ ] Lokalen Build und Preview testen: npm run build && npm run preview
- [ ] Merge nach main nach Review

Risiken, Annahmen & Mitigations
---
- Risiko: Next-spezifische Features fehlen (Image-Optim, Middleware). Mitigation: priorisieren, alternative libs (Unpic, server handlers) einplanen.
- Annahme: Projekt nutzt App Router (src/app). Wenn nicht, Pfade anpassen.
- Risiko: Tailwind-spezifische Klassen im CSS. Mitigation: identifizieren und entweder belassen (wenn bereits generiert) oder ersetzen durch plain CSS / modules.

Entscheidungsfragen (erfordern Antwort vor größeren Schritten)
---
- Soll die API-Strategie für die Migration Start-intern (server.handlers) oder extern (separater Backend-Service) sein? (empfohlen: server.handlers für kleine/simple API-Endpunkte, externes Backend für komplexe Backends)
- Deployment: bleibt Vercel oder weichen wir auf anderes Hosting aus? (beeinflusst start script)
- Images: Unpic installieren oder externen Service nutzen?

Nächste konkrete Aktion von meiner Seite (nach Ihrer Bestätigung)
---
- Wenn Sie bestätigen, dass wir idiomatisch bleiben und server.handlers für kleine APIs akzeptabel sind, passe ich spec.md & README.md minimal nochmal um: füge konkrete package.json dependency lists und ein vollständiges vite.config.ts + Beispiel-ESLint/Vitest-Scripts hinzu und implementiere design.md PoC-Checklist als ausführbares Schritt-für-Schritt (inkl. konkreter CLI-Befehle).
- Alternativ erstelle ich jetzt die vorgeschlagenen Code-Dateien (vite.config.ts, src/router.tsx, src/app/__root.tsx, src/app/index.tsx) als Änderungsvorschlag in einer Branch — möchten Sie, dass ich diese Dateien erzeugen soll?
