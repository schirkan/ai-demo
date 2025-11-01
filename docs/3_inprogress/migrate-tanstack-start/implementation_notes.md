Implementation Notes — Migration Next.js → TanStack Start (in-progress)

Zweck
---
Dieses Dokument verfolgt Implementierungsfortschritt, technische Entscheidungen, aufgetretene Probleme und offene Aufgaben während der Migration von Next.js auf TanStack Start. Es dient als lebendes Log für Reviewer und Mitwirkende.

Verweise
---
- Design: docs/1_design/migrate-tanstack-start/design.md
- Spec: docs/1_design/migrate-tanstack-start/spec.md
- README: docs/1_design/migrate-tanstack-start/README.md
- Task-Liste / Planung: docs/2_planning/migrate-tanstack-start/task_list.md

Status (kurz)
---
- Phase: Vorbereitung → PoC (Root + Home) geplant
- Branch: migration/migrate-to-tanstack-start (noch nicht erstellt)
- PoC-Dateien zu erzeugen: vite.config.ts, src/router.tsx, src/app/__root.tsx, src/app/index.tsx
- Offene Entscheidungen: API-Strategie, Deployment-Ziel, Image-Lösung (Unpic vs. external)

Initiale Implementation-Plan (konkret)
---
1. Branch anlegen: migration/migrate-to-tanstack-start
2. package.json scripts anpassen (dev/build/preview/start)
3. vite.config.ts anlegen mit tanstackStart plugin (routesDirectory: 'app')
4. Abhängigkeiten installieren:
   - deps: @tanstack/react-start, @tanstack/react-router
   - devDeps: vite, @vitejs/plugin-react, vite-tsconfig-paths
   - optional: @tanstack/react-query, @unpic/react
5. PoC Dateien anlegen:
   - src/app/__root.tsx
   - src/app/index.tsx
   - src/router.tsx
6. npm run dev testen und Fehler beheben
7. Iterativ weitere Seiten migrieren

Decisions (initial)
---
- Routing-Pattern: idiomatisch TanStack Start (nested routes, route-objects)
- routesDirectory: 'app' (um Next.js App Router-Konventionen zu erleichtern)
- Tailwind: NICHT nutzen
- API: Migration von kleinen Endpunkten per server.handlers (TanStack Start internal handlers)
- Images: Vorläufige Strategie: <img /> verwenden, Unpic später optional
- Next entfernen: Next wurde aus package.json entfernt (siehe package.json)

Implementation Log
---
- [ ] Branch created
- [ ] package.json scripts updated
- [ ] vite.config.ts created
- [ ] Dependencies installed
- [ ] PoC files added (vite.config.ts, src/router.tsx, src/app/__root.tsx, src/app/index.tsx)
- [ ] Dev server runs and PoC verified at http://localhost:3000
- [ ] Iterate pages & API migration

Open Issues / Blockers
---
- Zustimmung für API-Strategie (server.handlers vs. external) erforderlich to migrate API routes.
- Deployment target confirmation required to finalize "start" script.
- Need to decide whether to add @unpic/react now or replace next/image with <img> temporarily.

Next Actions (short)
---
- Bitte bestätigen: Soll ich die PoC-Dateien jetzt in der Repo anlegen und package.json scripts anpassen? (Ich kann das in einem neuen Branch migration/migrate-to-tanstack-start tun.)
- Falls ja: Soll ich außerdem die dependency-entries in package.json (install hints) direkt hinzufügen, or only create files and leave install to you?

Kontakt / Notizen
---
Trage hier während der Implementierung weitere Beobachtungen, Fehlerausgaben, CLI-Logs und Entscheidungen ein.
