Ziel
---
Migration des Projekts von Next.js auf TanStack Start (React). Ziel ist ein vollständiger Ersatz von Next.js durch TanStack Start unter Beachtung der offiziellen Migrationsanleitung (https://tanstack.com/start/latest/docs/framework/react/migrate-from-next-js) und Best Practices von TanStack Start / TanStack Router, inklusive Anpassung der Project-Naming-Conventions und Aktualisierung der package.json-Scripts. Next.js und dessen Abhängigkeiten sollen aus dem Projekt entfernt werden. Tailwind darf nicht importiert werden.

Key Requirements
---
- Vollständige Entfernung von Next.js (Code, Konfiguration, Abhängigkeiten).
- Aufsetzen von TanStack Start als Ersatz-Framework für Routing, Layout- / page-Konzept und Server-/Client-Patterns entsprechend dem offiziellen Migrationsleitfaden.
- Einhaltung der TanStack Start Best Practices und Namenskonventionen (z. B. src/app → __root.tsx, page.tsx → index.tsx oder createFileRoute, routesDirectory ggf. auf "app" setzen).
- Keine Einführung von Tailwind CSS.
- Anpassung der package.json-Scripts (dev, build, start, ggf. preview, lint, test) gemäß TanStack Start + Vite (z. B. "dev": "vite dev", "build": "vite build", "start": "node .output/server/index.mjs" oder passend zum gewählten Hosting).
- Migration und Anpassung aller bestehenden Seiten/Seitenlogiken, API-Endpunkte (Next.js API-Routen → Start server routes / server functions / externes API) und statischer Ressourcen.
- Sicherstellen, dass bestehende Komponenten/Assets weiterhin funktionieren (z. B. public/, images, statische Dateien).
- Klare Dokumentation der Migrationsschritte, Anpassungen an CI/CD und verbleibenden manuellen Aufgaben.

Target Audience
---
- Entwickler/Team, die die Migration durchführen.
- Reviewer/Code-Owner, die Änderungen abnehmen.
- DevOps/CI-Verantwortliche, die Scripts/Deployment anpassen müssen.

Wichtige Hinweise aus dem offiziellen TanStack-Guide (implementierungsrelevant)
---
- Projekt-Tooling: TanStack Start nutzt Vite; das Projekt sollte Vite-Plugins konfigurieren (vite, @tanstack/react-start/plugin/vite, @vitejs/plugin-react, vite-tsconfig-paths). In der offiziellen Anleitung wird tailwind-plugins im Vite-Config gezeigt — hier explizit NICHT verwenden.
- routesDirectory: Standard ist "routes". Um Konsistenz mit Next.js App Router zu behalten, empfiehlt die Anleitung, routesDirectory auf "app" zu setzen (tanstackStart({ router: { routesDirectory: 'app' }})).
- Layout & Dateien:
  - src/app/layout.tsx → src/app/__root.tsx (createRootRoute, HeadContent, Scripts, Outlet).
  - src/app/page.tsx → src/app/index.tsx / use createFileRoute or createFileRoute('/')({ component: Home }).
- Links: next/link → @tanstack/react-router Link (href → to).
- Images: next/image → Unpic (@unpic/react) oder alternative image solutions; kontrollieren, welche Optimizations benötigt werden.
- API / Server functions: Next.js API-Routen und 'use server' Actions → Start server functions (createServerFn) or server route handlers (createFileRoute with server.handlers).
- Fetching: getServerSideProps/getStaticProps → loader functions or Route.useLoaderData() or React Query / TanStack Query integration.
- Verify: After migration run npm run dev (vite dev) and verify the Start welcome page. The guide provides a post-migration repo for reference.

Open Questions (entscheidungsrelevant)
---
- Welches Routing-Pattern bevorzugen Sie für die Migration?
  - Option 1 — Minimal/1:1: Behalte vorhandene Struktur weitgehend (fast file-based mapping, schnelle Migration).
  - Option 2 — TanStack Start idiomatisch: Reorganisiere zu route-objects / nested routes (empfohlen langfristig).
- Wie sollen Next.js-spezifische server-seitige Features abgebildet werden?
  - Beibehalten von SSR/SSG-Verhalten (eigener Node-Server / prerendering) oder Umstieg auf client-first + loaders?
- API-Routen: Sollen bestehende Next.js API-Routen als Start Server Routes (in src/app/*.ts) nachgebildet werden oder in ein separates Backend verschoben werden (z. B. Express, Fastify, oder externe Services)?
- Images: Möchten Sie Unpic als Drop-in verwenden oder eine andere Lösung / externen Service?
- Deployment-Ziel: Bleibt Vercel bestehen oder wechselt das Projekt zu z. B. Netlify, Cloudflare, eigener Host? (Das beeinflusst start-Script und Build-Output.)
- Environment-Variablen: Sollen bestehende NEXT_PUBLIC_* Variablen unverändert bleiben oder umbenannt werden?
- TypeScript / Pfad-Aliase: Möchten Sie vite-tsconfig-paths nutzen und die routesDirectory auf "app" setzen, um möglichst wenig Umbenennungen vorzunehmen?

Empfohlene erste Schritte (konkret, priorisiert)
---
1. Branch & Backup: Erstelle branch migration/migrate-to-tanstack-start.
2. Inventar: Liste Next-spezifische Features (next.config, app/pages/, API-Routen, getServerSideProps/getStaticProps, next/image, next/font, middleware).
3. Bootstrapping:
   - package.json scripts anpassen: dev → "vite dev", build → "vite build", start → geeigneter Start-Befehl.
   - Vite konfigurieren: vite.config.ts mit tanstackStart plugin, @vitejs/plugin-react, tsconfig-paths. Setze routesDirectory auf "app" falls gewünscht.
   - Install: @tanstack/react-start, @tanstack/react-router, @vitejs/plugin-react, vite, vite-tsconfig-paths. (Kein tailwind installieren/importieren.)
4. Root-Layout & Home: Rename src/app/layout.tsx → src/app/__root.tsx und src/app/page.tsx → src/app/index.tsx entsprechend Guide (Proof-of-Concept).
5. Router: Erstelle src/router.tsx / routeTree.gen wie im Guide; initiale Route für '/'.
6. Test: npm run dev → prüfe http://localhost:3000, behebe TypeScript/Import-Fehler.
7. Iterative Migration: Seiten, Links, Images, API-Routen, Data-Fetching, CI-Anpassungen.
8. Cleanup: Entfernen next-abhängiger Dateien, package-lock Anpassungen, finaler Merge.

Nächste Schritte von meiner Seite
---
- Ich kann die spec.md und design.md nun präziser an die konkreten code-Änderungen aus dem Leitfaden anpassen (z. B. Beispiele für __root.tsx, index.tsx, vite.config.ts sowie konkrete package.json-Script-Vorschläge). Soll ich das jetzt tun?
- Für kritische Designentscheidungen (Routing-Option, API-Strategie, Deployment-Ziel, Image-Lösung) bitte eine Auswahl treffen — ich werde dann die Spezifikation und das Migrations-Checklist entsprechend anpassen.
